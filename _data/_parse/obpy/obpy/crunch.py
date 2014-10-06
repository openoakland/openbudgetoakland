import logging

_logger = logging.getLogger(__name__)

def tree(data, map_func, reduce_func):
    '''
    Builds tree data structure on input data.

    data -> list of dictionaries
    map_func -> function which returns list of keys for hierarchical data and a value
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

def squeeze(hierarchy):
    if 'children' in hierarchy:
        if len(hierarchy['children']) == 1:
            if hierarchy['key'][-1] == hierarchy['children'].values()[0]['key'][-1]:
                hierarchy['children'] = hierarchy['children'].values()[0].get('children', {})
        for child in hierarchy['children'].values():
            squeeze(child)
        if len(hierarchy['children']) == 0:
            del hierarchy['children']

