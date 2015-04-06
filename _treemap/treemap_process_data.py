import json
import csv
import pprint
import argparse
import logging
import codecs
import operator

_logger = logging.getLogger(__name__)

class Error(Exception):
    pass

def _load_csv(filepath):
    '''Loads a csv file and returns it as a list of dictionaries.  Each dictionary
    has the headers of the csv file as the keys and the row entries as the values.

    Example:

        A CSV file looking like this:

        Animal, Name, Color
        Dog, Ollie, Brown
        Dob, Lou, Grey
        Fish, Nemo, Orange
        Cat, Olga, Black

        Will come out like this:

        [
            {'Animal': 'Dog', 'Name': 'Ollie', 'Color': 'Brown'},
            {'Animal': 'Dog', 'Name': 'Lou', 'Color': 'Grey'},
            {'Animal': 'Fish', 'Name': 'Nemo', 'Color': 'Orange'},
            {'Animal': 'Cat', 'Name': 'Olga', 'Color': 'Black'}
        ]
    '''

    data = []

    # open csv file and create csv reader
    reader = csv.reader(open(filepath, 'rU'))

    # interperate the first row as the header
    header = reader.next()
    header_length = len(header)

    for row in reader:
        # check that the row matches the header
        row_length = len(row)
        if row_length != header_length:
            _logger.warning(
                'Number of element in row ({0}) does not match number of elements in header ({1}) in "{2}" line {3}'.format(
                    row_length, header_length, filepath, reader.line_num))
            _logger.debug('header: {0}'.format(header))
            _logger.debug('row: {0}'.format(row))

            if row_length < header_length:
                _logger.info('Appending empty values to row {0}'.format(reader.line_num))
                row = row + ([None] * (header_length - row_length))
            else:
                _logger.info('Truncating row {0}'.format(reader.line_num))
                row = row[0:header_length]

        # convert list into a dictionary and store in "data"
        data.append(dict(zip(header, row)))

    _logger.info('Loaded {0} items'.format(len(data)))
    return data

def _check_field(d, f):
    if not (f in d):
        _logger.error('configuration missing field "{0}"'.format(f))
        raise Error({'message': 'invalid configuration'})

def _validate_configuration(config, budget):
    '''Validates the configuration for this module and makes sure all the 
    headers in the configuration match those found in the budget'''
    used_headers = set()

    # check that config has 'account_type' field and get the value used
    _check_field(config, 'account_type_header')
    used_headers.add(config['account_type_header'])

    # check that only expense and revenue exist in account_types
    _check_field(config, 'account_types')
    types = set(config['account_types'].keys())
    expected_types = set(['revenue', 'expense'])
    if types != expected_types:
        _logger.error(
            'the "account_types" field must only have the "revenue" and "expense" fields')
        _logger.debug('found account types: {0}'.format(types))

    # check that config has 'amount_header' field and get the value used
    _check_field(config, 'amount_header')
    used_headers.add(config['amount_header'])

    # check that config has 'grouping_headers' field. Also get all headers used
    # to determine groups
    _check_field(config, 'grouping_headers')
    used_headers |= set(config['grouping_headers'])

    # check the config has 'groups' field
    _check_field(config, 'groups')

    # Check that each group has the appropriate fields.  Also get all headers
    # used to describe groups
    for group in config['groups']:
        _check_field(group, 'values')
        if len(group['values']) != len(config['grouping_headers']):
            _logger.error(
                'number of "values" in group ({0}) does not match number of headers in "grouping_headers" ({1})'.format(
                    len(group['values']), len(config['grouping_headers'])))

        _check_field(group, 'hierarchy')
        used_headers |= set(group['hierarchy'])

    # check that all headers used in configuration exist in budget items
    headers = set(budget[0].keys())
    for used_header in used_headers:
        if not (used_header in headers):
            _logger.error(
                'header "{0}" used in configuration but not found in budget headers'.format(
                    used_header))
            _logger.debug('budget headers: {0}'.format(headers))
            raise Error({'message': 'invalid configuration'})

def _split_revenue_expense(config, budget):
    '''Assigns "expense" and "revenue" fields to budget items'''
    type_header = config['account_type_header']
    amount_header = config['amount_header']
    revenue = config['account_types']['revenue']
    expense = config['account_types']['expense']
    for i, item in enumerate(budget):
        item['amount'] = float(item[amount_header])
        if item[type_header] == revenue:
            item['revenue'] = item['amount']
            item['expense'] = 0.0
        elif item[type_header] == expense:
            item['revenue'] = 0.0
            item['expense'] = item['amount']
        else:
            _logger.error(
                'budget item not classified as revenue or expense on line {0}'.format(
                    i + 1))
            raise Error({'message': 'budget error'})

def _tree(data, map_func, reduce_func):
    '''
    Builds tree data structure on input data.

    data        -> list of dictionaries
    map_func    -> function which returns list of keys for hierarchical data and a value
    reduce_func -> function which takes 2 arguments and combines them
    '''
    _logger.info('creating tree from {0} rows of data'.format(len(data)))
    entries = map(map_func, data)
    if len(entries) < 1:
        return {}
    out = {'children':{}}

    for keys, value in entries:
        node = out
        for depth in range(0, len(keys) + 1):
            full_key = keys[0:depth]
            this_key = None
            if len(full_key) > 0:
                this_key = full_key[-1]
            else:
                this_key = ''

            child_node = node['children'].get(this_key)
            if child_node is None:
                child_node = {}
                node['children'][this_key] = child_node
            
            if child_node.get('key') is None:
                child_node['data'] = value
                child_node['key'] = full_key
                child_node['children'] = {}
            else:
                child_node['data'] = reduce_func(child_node['data'], value)
            node = child_node
    return out['children']['']

def _squeeze(hierarchy):
    '''If a node has only one child, and the child shares the same key, then 
    the child is removed.  If the child had children, they are assigned to the parent.'''
    if 'children' in hierarchy:
        if len(hierarchy['children']) == 1:
            if len(hierarchy['key']) > 0:
                if hierarchy['key'][-1] == hierarchy['children'].values()[0]['key'][-1]:
                    hierarchy['children'] = hierarchy['children'].values()[0].get('children', {})
        for child in hierarchy['children'].values():
            _squeeze(child)
        if len(hierarchy['children']) == 0:
            del hierarchy['children']

def _create_key_generator(hierarchy):
    def _map_line(x):
        key = map(lambda y: x[y], hierarchy)
        value = {
            'amount': x['amount'],
            'revenue': x['revenue'],
            'expense': x['expense']
        }
        return (key, value)
    return _map_line

def _reduce_lines(x, y):
    z = {
        'amount': x['amount'] + y['amount'],
        'revenue': x['revenue'] + y['revenue'],
        'expense': x['expense'] + y['expense']
    }
    return z

def _create_group_map_function(headers):
    def _group_map(budget_item):
        return (tuple(map(lambda x: budget_item[x], headers)), budget_item)
    return _group_map

def _group(config, budget):
    groups = []
    # create a copy of budget items with ((group_info), (budget_item))
    budget_groups = map(
        _create_group_map_function(config['grouping_headers']),
        budget)

    left_over = list(budget_groups)

    for group in config['groups']:
        # get all budget items that match the group's "values"
        key = tuple(group['values'])
        budget_group = filter(lambda x: x[0] == key, budget_groups)
        group_copy = dict(group)

        # store budget items with configuration
        group_copy['budget'] = map(operator.itemgetter(1), budget_group)
        groups.append(group_copy)

        # remove used up items
        left_over = filter(lambda x: x[0] != key, left_over)

    unused = set(map(operator.itemgetter(0), left_over))
    if len(unused) > 0:
        _logger.warning('there are {0} unused budget items'.format(len(left_over)))
        for category in unused:
            _logger.debug(
                'unused values: {0}'.format(
                    dict(zip(config['grouping_headers'], category))))
        
    return groups

def _prep_for_treemap(data):
    if len(data['key']) == 0:
        data['key'] = 'Budget'
    else:
        data['key'] = data['key'][-1]
    if 'children' in data:
        data['values'] = data['children'].values()
        del data['children']
        data['values'] = map(_prep_for_treemap, data['values'])
    return data

def _prepare(config_filepath, budget_filepath):
    # load budget
    _logger.info('Loading budget file "{0}"'.format(budget_filepath))
    budget = _load_csv(budget_filepath)

    # load configuration
    _logger.info('Loading configuration file "{0}"'.format(config_filepath))
    config = json.load(open(config_filepath, 'r'))

    # check that the configuration is correct and that matches the budget data
    _validate_configuration(config, budget)

    # assign revenue and expense fields to the budget
    _split_revenue_expense(config, budget)

    groups = _group(config, budget)

    # organize everything into a tree
    for group in groups:
        _logger.debug('creating tree for {0}'.format(group['values']))
        group['tree'] = _tree(
            group['budget'], 
            _create_key_generator(group['hierarchy']),
            _reduce_lines)
        # remove silly hierarchies with single duplicate children
        _squeeze(group['tree'])
        # rename fields for treemap viewer
        group['tree'] = _prep_for_treemap(group['tree'])

        # write output groups
        _check_field(group, 'filename')
        json.dump(group['tree'], open(group['filename'], 'w'))


if __name__ == '__main__':
    logging.basicConfig(
        level=logging.DEBUG,
        format='%(levelname)s: %(message)s'
    )

    parser = argparse.ArgumentParser(
        description='Create treemap data files from a budget in CSV format.')
    parser.add_argument(
        'configuration', 
        action='store',
        type=str, 
        nargs=1,
        help='A configuration file describing how the data should be organized.')
    parser.add_argument(
        'budget',
        action='store',
        type=str,
        nargs=1,
        help='A CSV formatted budget')

    args = parser.parse_args()
    _prepare(args.configuration[0], args.budget[0]) 
    

