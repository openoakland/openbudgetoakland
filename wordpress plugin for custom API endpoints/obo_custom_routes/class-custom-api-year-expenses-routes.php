<?php

defined( 'ABSPATH' ) or die( 'Nice try!' );

#require( plugin_dir_path( __FILE__ ) . 'class-simple-settings-page.php' );

if ( ! class_exists('OBO_Custom_API_Year_Expenses_Routes') ):

class OBO_Custom_API_Year_Expenses_Routes extends WP_REST_Controller {

    /**
     * A numerical string for keeping track of API versions
     * @var String
     * @since   0.1.0
     */
    protected $version;

    /**
     * A name that keeps variable names of this API distinguishable from those of other APIs. It is inherited from WP_REST_Controller
     * @var String
     */
    //protected $namespace;

    /**
     * A URL identifying the JSON schema to be used
     * @var String
     * @since 0.1.0 
     */
    protected $json_schema_src;

    /**
     * A name that defines a set of API routes. It is inherited from WP_REST_Controller
     * @var String
     */
    //protected $rest_base;

    public function __construct($api_version, $api_namespace, $json_schema_src) {
        $this->version = $api_version;
        $this->namespace = $api_namespace . '/v' . $this->version;
        $this->json_schema_src = $json_schema_src;
        $this->rest_base = "fiscal-years-expenses/"; // change as needed
        $this->register_routes();
    }

    /**
     * Register routes for the controller.
     */
    public function register_routes() {
        // Do not implement POST, PUT, UPDATE or CREATE; this API is strictly read-only

        register_rest_route( $this->namespace, '/' . $this->rest_base, array(
            'methods'         => WP_REST_Server::READABLE,
            'callback'        => array( $this, 'get_year_totals' ),
            'permission_callback' => array( $this, 'get_items_permissions_check' ),
            'args'            => array(),
            //'schema' => array($this, 'get_item_schema') // could also be null
        ));

        register_rest_route( $this->namespace, '/' . $this->rest_base . 'depts/' . '(?P<fiscal_year_range>[\S]+)', array(
            'methods'       => WP_REST_Server::READABLE,
            'callback'      => array( $this, 'get_year_dept_totals' ),
            'permission_callback' => array( $this, 'get_items_permissions_check' ),
            'args'          => array(),

        ));

        register_rest_route( $this->namespace, '/' . $this->rest_base . 'accounts/' . '(?P<fiscal_year_range>[\S]+)', array(
            'methods'       => WP_REST_Server::READABLE,
            'callback'      => array( $this, 'get_year_account_totals' ),
            'permission_callback' => array( $this, 'get_items_permissions_check' ),
            'args'          => array(),

        ));

        register_rest_route( $this->namespace, '/' . $this->rest_base . 'account-cats/' . '(?P<fiscal_year_range>[\S]+)', array(
            'methods'       => WP_REST_Server::READABLE,
            'callback'      => array( $this, 'get_year_accountcat_totals' ),
            'permission_callback' => array( $this, 'get_items_permissions_check' ),
            'args'          => array(),

        ));

        register_rest_route( $this->namespace, '/' . $this->rest_base . 'funds/' . '(?P<fiscal_year_range>[\S]+)', array(
            'methods'       => WP_REST_Server::READABLE,
            'callback'      => array( $this, 'get_year_fund_totals' ),
            'permission_callback' => array( $this, 'get_items_permissions_check' ),
            'args'          => array(),

        ));
    }

    /**
     * Get a collections of items
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Response
     * @uses   $wpdb->get_results() which returns an indexed array of row objects whose contents can be accessed with $row->column_name
     */
    public function get_year_totals( $request ) {
        global $wpdb;

        $prefix = $wpdb->prefix;
        $table = $prefix . 'oakland_budget_items';

        $data = array();

        $query_e = $wpdb->prepare("
            SELECT budget_type, fiscal_year_range, SUM(amount_num) AS total
            FROM $table 
            WHERE account_type = %s
            GROUP BY budget_type, fiscal_year_range
        ", 'Expense' );
        $expense_items = $wpdb->get_results( $query_e );
        // Check to see that there is something to send
        if ( empty($expense_items) ) {
            return new WP_Error( $this->rest_base, 'No expense items found', array('status' => 404) );
        }
        // Start preparing response by adding "expenses" object to data array
        foreach ($expense_items as $row) {
            // $data_item = $this->prepare_item_for_response( $row, $request );
            $data_item = $this->prepare_year_totals_for_response( $row, $request );

            $data[] = $this->prepare_response_for_collection( $data_item );
        }

        return new WP_REST_Response( $data, 200 );
    }

    public function get_year_dept_totals( $request ) {
        global $wpdb;

        $prefix = $wpdb->prefix;
        $table = $prefix . 'oakland_budget_items';
        $fiscal_year_range = $request->get_param('fiscal_year_range');

        $data = array();

        $query_e = $wpdb->prepare("
            SELECT budget_type, fiscal_year_range, department, SUM(amount_num) AS total
            FROM $table 
            WHERE account_type = %s AND fiscal_year_range = %s
            GROUP BY budget_type, department
        ", 'Expense', $fiscal_year_range );
        $expense_items = $wpdb->get_results( $query_e );
        // Check to see that there is something to send
        if ( empty($expense_items) ) {
            return new WP_Error( $this->rest_base, 'No expense items found', array('status' => 404) );
        }
        // Start preparing response by adding "expenses" object to data array
        foreach ($expense_items as $row) {
            // $data_item = $this->prepare_item_for_response( $row, $request );
            $data_item = $this->prepare_year_dept_totals_for_response( $row, $request );

            $data[] = $this->prepare_response_for_collection( $data_item );
        }

        return new WP_REST_Response( $data, 200 );
    }

    public function get_year_account_totals( $request ) {
        global $wpdb;

        $prefix = $wpdb->prefix;
        $table = $prefix . 'oakland_budget_items';
        $fiscal_year_range = $request->get_param('fiscal_year_range');

        $data = array();

        $query_e = $wpdb->prepare("
            SELECT budget_type, fiscal_year_range, account_description, SUM(amount_num) AS total
            FROM $table 
            WHERE account_type = %s AND fiscal_year_range = %s
            GROUP BY budget_type, account_description
        ", 'Expense', $fiscal_year_range );
        $expense_items = $wpdb->get_results( $query_e );
        // Check to see that there is something to send
        if ( empty($expense_items) ) {
            return new WP_Error( $this->rest_base, 'No expense items found', array('status' => 404) );
        }
        // Start preparing response by adding "expenses" object to data array
        foreach ($expense_items as $row) {
            // $data_item = $this->prepare_item_for_response( $row, $request );
            $data_item = $this->prepare_year_account_totals_for_response( $row, $request );

            $data[] = $this->prepare_response_for_collection( $data_item );
        }

        return new WP_REST_Response( $data, 200 );
    }

    public function get_year_accountcat_totals( $request ) {
        global $wpdb;

        $prefix = $wpdb->prefix;
        $table = $prefix . 'oakland_budget_items';
        $fiscal_year_range = $request->get_param('fiscal_year_range');

        $data = array();

        $query_e = $wpdb->prepare("
            SELECT budget_type, fiscal_year_range, account_category, SUM(amount_num) AS total
            FROM $table 
            WHERE account_type = %s AND fiscal_year_range = %s
            GROUP BY budget_type, account_category
        ", 'Expense', $fiscal_year_range );
        $expense_items = $wpdb->get_results( $query_e );
        // Check to see that there is something to send
        if ( empty($expense_items) ) {
            return new WP_Error( $this->rest_base, 'No expense items found', array('status' => 404) );
        }
        // Start preparing response by adding "expenses" object to data array
        foreach ($expense_items as $row) {
            // $data_item = $this->prepare_item_for_response( $row, $request );
            $data_item = $this->prepare_year_accountcat_totals_for_response( $row, $request );

            $data[] = $this->prepare_response_for_collection( $data_item );
        }

        return new WP_REST_Response( $data, 200 );
    }

    public function get_year_fund_totals( $request ) {
        global $wpdb;

        $prefix = $wpdb->prefix;
        $table = $prefix . 'oakland_budget_items';
        $fiscal_year_range = $request->get_param('fiscal_year_range');

        $data = array();

        $query_e = $wpdb->prepare("
            SELECT budget_type, fiscal_year_range, fund_description, SUM(amount_num) AS total
            FROM $table 
            WHERE account_type = %s AND fiscal_year_range = %s
            GROUP BY budget_type, fund_description
        ", 'Expense', $fiscal_year_range );
        $expense_items = $wpdb->get_results( $query_e );
        // Check to see that there is something to send
        if ( empty($expense_items) ) {
            return new WP_Error( $this->rest_base, 'No expense items found', array('status' => 404) );
        }
        // Start preparing response by adding "expenses" object to data array
        foreach ($expense_items as $row) {
            // $data_item = $this->prepare_item_for_response( $row, $request );
            $data_item = $this->prepare_year_fund_totals_for_response( $row, $request );

            $data[] = $this->prepare_response_for_collection( $data_item );
        }

        return new WP_REST_Response( $data, 200 );
    }

    /**
     * Check if a given request has access to get items
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|bool
     */
    public function get_items_permissions_check( $request ) {
        return true;
        // return current_user_can( 'edit_something' );
    }

    /**
     * Check if a given request has access to get a specific item
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|bool
     */
    public function get_item_permissions_check( $request ) {
        return $this->get_items_permissions_check( $request );
    }

    /**
     * Prepare the item for the REST response
     *
     * @param mixed $row Row object returned from a database query.
     * @param WP_REST_Request $request Request object.
     * @return mixed
     */
    public function prepare_year_totals_for_response( $row, $request ) {
        // Define schema
        $schema = $this->get_item_schema();

        // Prepare data array from $row
        $data = array();

        $data['budget_type'] = ( ! empty( $schema['properties']['budget_type'] ) )? $row->budget_type : '' ;
        $data['fiscal_year_range'] = ( ! empty( $schema['properties']['fiscal_year_range'] ) )? $row->fiscal_year_range : '' ;
        $data['total'] = ( ! empty( $schema['properties']['total'] ) )? $row->total : '' ;
        //Set context
        $data = $this->add_additional_fields_to_object( $data, $request );
        $context = ! empty( $request['context'] ) ? $request['context'] : 'view';
        $data = $this->filter_response_by_context( $data, $context );
        // Wrap the data in a response object.
        $response = rest_ensure_response( $data );
        #$response->add_links( $this->prepare_links( $row ) );
        
        return apply_filters( "rest_prepare_{$this->rest_base}", $response, $row, $request );
    }

    /**
     * Prepare the item for the REST response
     *
     * @param mixed $row Row object returned from a database query.
     * @param WP_REST_Request $request Request object.
     * @return mixed
     */
    public function prepare_year_dept_totals_for_response( $row, $request ) {
        // Define schema
        $schema = $this->get_item_schema();

        // Prepare data array from $row
        $data = array();

        $data['budget_type'] = ( ! empty( $schema['properties']['budget_type'] ) )? $row->budget_type : '' ;
        $data['fiscal_year_range'] = ( ! empty( $schema['properties']['fiscal_year_range'] ) )? $row->fiscal_year_range : '' ;
        $data['department'] = ( ! empty( $schema['properties']['department'] ) )? $row->department : '' ;
        $data['total'] = ( ! empty( $schema['properties']['total'] ) )? $row->total : '' ;
        //Set context
        $data = $this->add_additional_fields_to_object( $data, $request );
        $context = ! empty( $request['context'] ) ? $request['context'] : 'view';
        $data = $this->filter_response_by_context( $data, $context );
        // Wrap the data in a response object.
        $response = rest_ensure_response( $data );
        #$response->add_links( $this->prepare_links( $row ) );
        
        return apply_filters( "rest_prepare_{$this->rest_base}", $response, $row, $request );
    }

    /**
     * Prepare the item for the REST response
     *
     * @param mixed $row Row object returned from a database query.
     * @param WP_REST_Request $request Request object.
     * @return mixed
     */
    public function prepare_year_account_totals_for_response( $row, $request ) {
        // Define schema
        $schema = $this->get_item_schema();

        // Prepare data array from $row
        $data = array();

        $data['budget_type'] = ( ! empty( $schema['properties']['budget_type'] ) )? $row->budget_type : '' ;
        $data['fiscal_year_range'] = ( ! empty( $schema['properties']['fiscal_year_range'] ) )? $row->fiscal_year_range : '' ;
        $data['account_description'] = ( ! empty( $schema['properties']['account_description'] ) )? $row->account_description : '' ;
        $data['total'] = ( ! empty( $schema['properties']['total'] ) )? $row->total : '' ;
        //Set context
        $data = $this->add_additional_fields_to_object( $data, $request );
        $context = ! empty( $request['context'] ) ? $request['context'] : 'view';
        $data = $this->filter_response_by_context( $data, $context );
        // Wrap the data in a response object.
        $response = rest_ensure_response( $data );
        #$response->add_links( $this->prepare_links( $row ) );
        
        return apply_filters( "rest_prepare_{$this->rest_base}", $response, $row, $request );
    }

    /**
     * Prepare the item for the REST response
     *
     * @param mixed $row Row object returned from a database query.
     * @param WP_REST_Request $request Request object.
     * @return mixed
     */
    public function prepare_year_accountcat_totals_for_response( $row, $request ) {
        // Define schema
        $schema = $this->get_item_schema();

        // Prepare data array from $row
        $data = array();

        $data['budget_type'] = ( ! empty( $schema['properties']['budget_type'] ) )? $row->budget_type : '' ;
        $data['fiscal_year_range'] = ( ! empty( $schema['properties']['fiscal_year_range'] ) )? $row->fiscal_year_range : '' ;
        $data['account_category'] = ( ! empty( $schema['properties']['account_category'] ) )? $row->account_category : '' ;
        $data['total'] = ( ! empty( $schema['properties']['total'] ) )? $row->total : '' ;
        //Set context
        $data = $this->add_additional_fields_to_object( $data, $request );
        $context = ! empty( $request['context'] ) ? $request['context'] : 'view';
        $data = $this->filter_response_by_context( $data, $context );
        // Wrap the data in a response object.
        $response = rest_ensure_response( $data );
        #$response->add_links( $this->prepare_links( $row ) );
        
        return apply_filters( "rest_prepare_{$this->rest_base}", $response, $row, $request );
    }

    /**
     * Prepare the item for the REST response
     *
     * @param mixed $row Row object returned from a database query.
     * @param WP_REST_Request $request Request object.
     * @return mixed
     */
    public function prepare_year_fund_totals_for_response( $row, $request ) {
        // Define schema
        $schema = $this->get_item_schema();

        // Prepare data array from $row
        $data = array();

        $data['budget_type'] = ( ! empty( $schema['properties']['budget_type'] ) )? $row->budget_type : '' ;
        $data['fiscal_year_range'] = ( ! empty( $schema['properties']['fiscal_year_range'] ) )? $row->fiscal_year_range : '' ;
        $data['fund_description'] = ( ! empty( $schema['properties']['fund_description'] ) )? $row->fund_description : '' ;
        $data['total'] = ( ! empty( $schema['properties']['total'] ) )? $row->total : '' ;
        //Set context
        $data = $this->add_additional_fields_to_object( $data, $request );
        $context = ! empty( $request['context'] ) ? $request['context'] : 'view';
        $data = $this->filter_response_by_context( $data, $context );
        // Wrap the data in a response object.
        $response = rest_ensure_response( $data );
        #$response->add_links( $this->prepare_links( $row ) );
        
        return apply_filters( "rest_prepare_{$this->rest_base}", $response, $row, $request );
    }

    public function get_item_schema() {
        $schema = array(
            '$schema'    => $this->json_schema_src,
            'title'      => $this->rest_base,
            'type'       => 'object',
            'properties' => array(
                'id' => array(
                    'description' => __("Unique identifier"),
                    'type' => 'integer',
                    'context' => array('view', 'embed'),
                    'readonly' => true
                ),
                'budget_type' => array(
                    'description' => __("Status of budget, such as 'Adopted'"),
                    'type' => 'string',
                    'context' => array('view', 'embed'),
                    'readonly' => true
                ),
                'fiscal_year_range' => array(
                    'description' => __("Years spanned by fiscal year, such as 'FY2013-2014'"),
                    'type' => 'string',
                    'context' => array('view', 'embed'),
                    'readonly' => true
                ),
                'department' => array(
                    'description' => __("Department within the City of Oakland"),
                    'type' => 'string',
                    'context' => array('view', 'embed'),
                    'readonly' => true
                ),
                'fund_description' => array(
                    'description' => __("Fund used for a set of budget items."),
                    'type' => 'string',
                    'context' => array('view', 'embed'),
                    'readonly' => true
                ),
                'account_description' => array(
                    'description' => __("Account used for a set of budget items. This may often serve as a description of how money will be spent, when budget type is Expense."),
                    'type' => 'string',
                    'context' => array('view', 'embed'),
                    'readonly' => true
                ),
                'account_category' => array(
                    'description' => __("Account category used for a set of budget items. This is one level up from account_description."),
                    'type' => 'string',
                    'context' => array('view', 'embed'),
                    'readonly' => true
                ),
                'total' => array(
                    'description' => __("Sum of all the expense line items in the budget"),
                    'type' => 'integer',
                    'context' => array('view', 'embed'),
                    'readonly' => true
                )
            )
        );
        return $this->add_additional_fields_schema($schema);
    }


    /*******************************************/    
    /* Let WP_REST_Controller handle these */
    /*******************************************/
        // public function prepare_response_for_collection( $response ) {}
        // public function filter_response_by_context( $data, $context ) {}
        // public function get_public_item_schema( $response ) {}
        // public function get_collection_params() {}
        // public function get_context_param( $arg = array() ) {}
        // public function add_additional_fields_to_object( $row, $request ) {}
        // public function update_additional_fields_for_object( $row, $request ) {}
        // public function add_additional_fields_schema( $schema ) {}
        // public function get_additional_fields( $object_type = null ) {}
        // public function get_object_type() {}
        // public function prepare_response_for_collection( $response ) {}
        // public function get_endpoint_args_for_item_schema( $method = WP_REST_Server::CREATABLE ) {}
        // 
}


endif;