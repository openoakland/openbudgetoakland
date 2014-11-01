import re
import os
import sys
import logging
import json
import codecs
import copy

import obpy.crunch
import obpy.xlsx

_logger = logging.getLogger(__name__)

def _title(x):
    return x.title()

def _pass(x):
    return x

_xlsx_config = {
    'worksheets': [
        {
            'type': 'budget',
            'patterns': [
                re.compile(r'.*', re.I)
            ],
            'max_header_search_depth': 5,
            'headers': [
                {
                    'type': 'year',
                    'patterns': [
                        re.compile(r'.*year.*', re.I)
                    ],
                    'process': _pass
                },
                {
                    'type': 'department',
                    'patterns': [
                        re.compile(r'^department$', re.I)
                    ],
                    'process': _title
                },
                {
                    'type': 'division',
                    'patterns': [
                        re.compile(r'.*division.*', re.I)
                    ],
                    'process': _title
                },
                {
                    'type': 'fund',
                    'patterns': [
                        re.compile(r'.*fund.*description.*', re.I)
                    ],
                    'process': _title
                },
                {
                    'type': 'program',
                    'patterns': [
                        re.compile(r'.*program.*description', re.I)
                    ],
                    'process': _title
                },
                {
                    'type': 'account_type',
                    'patterns': [
                        re.compile(r'.*account.*type.*', re.I)
                    ],
                    'process': _title
                },
                {
                    'type': 'account_category',
                    'patterns': [
                        re.compile(r'.*account.*category.*', re.I)
                    ],
                    'process': _title
                },
                {
                    'type': 'account_description',
                    'patterns': [
                        re.compile(r'.*account.*description.*', re.I)
                    ],
                    'process': _title
                },
                {
                    'type': 'amount',
                    'patterns': [
                        re.compile(r'.*amount.*', re.I)
                    ],
                    'process': float
                }
            ]
        }
    ]
}

def _split_revenue_expense(x):
    t = x.get('account_type')
    if t == 'Revenue':
        x['revenue'] = x['amount']
        x['expense'] = 0.0
    elif t == 'Expense':
        x['revenue'] = 0.0
        x['expense'] = x['amount']
    else:
        _logger.warning('unhandled account type {0} for line-item {1}'.format(t, x))
    return x

def _map_line(x):
    key = None
    if x['account_type'].lower() == 'expense':
        key = [
            x['account_type'], 
            x['year'], 
            x['fund'], 
            x['department'], 
            x['division'], 
            x['account_category'], 
            x['account_description']
        ]
    elif x['account_type'].lower() == 'revenue':
        key = [
            x['account_type'], 
            x['year'], 
            x['fund'], 
            x['account_category'], 
            x['account_description']
        ]
    else:
        _logger.warning('Unhandled account type "{0}"'.format(x['account_type']))
        key = [x['account_type']]

    value = {
        'amount': x['amount'],
        'revenue': x['revenue'],
        'expense': x['expense']
    }
    return (key, value)

def _reduce_lines(x, y):
    z = {
        'amount': x['amount'] + y['amount'],
        'revenue': x['revenue'] + y['revenue'],
        'expense': x['expense'] + y['expense']
    }
    return z

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

def _process_budget(filepath):
    _logger.info('processing budget {0}'.format(filepath))
    data = obpy.xlsx.parse(filepath, _xlsx_config)
    data = map(_split_revenue_expense, data['budget'])
    hierarchy = obpy.crunch.tree(data, _map_line, _reduce_lines)
    obpy.crunch.squeeze(hierarchy)
    hieararchy = _prep_for_treemap(hierarchy)
    return hierarchy



def _print_usage():
    print '\n\n\tusage: python', os.path.basename(__file__), '<excel> <output_prefix>\n\n'

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    if len(sys.argv) == 3:
        
        data = _process_budget(sys.argv[1])
        for top in data['values']:
            for second in top['values']:
                obj = copy.deepcopy(second)
                outpath = sys.argv[2] + top['key'] + '.' + second['key'] + '.json'
                obj['key'] = 'Budget'
                json.dump(obj, codecs.open(outpath, 'w', 'utf-8'))
        
    else:
        _print_usage()
