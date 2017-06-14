<?php
/*
 * Plugin Name: Open Budget Oakland Custom API Routes
 * Description: Create custom endpoints for the Open Budget Oakland API created by the WordPress REST API plugin.
 *
 * Author: Felicia Betancourt
 * Author URI:  http://go-firefly.com/
 * Plugin URI:  
 * Version:     0.6.1
 * Text Domain: obo-custom-routes
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */  

/*
Copyright 2017  Felicia Betancourt  (email : info@go-firefly.com)

This program is free software designed chiefly for teaching purposes; 
you can redistribute it and/or modifyit under the terms of the 
GNU General Public License, version 2, as published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

For a copy of the GNU General Public License, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

See readme.txt for changelog.
*/  

defined( 'ABSPATH' ) or die( 'Nice try!' );

// SET PLUGIN VERSION NUMBER
define( 'OBO_CUSTOM_ROUTES_VERSION','0.6.1' );

// SET PLUGIN TEXT-DOMAIN
define('OBO_CUSTOM_ROUTES_SLUG', 'obo_custom_routes');

// SET API VERSION
define('OBO_CUSTOM_ROUTES_API_VERSION', '1');

// SET API NAMESPACE
define('OBO_CUSTOM_ROUTES_API_NAMESPACE', 'obo');

// SET JSON SCHEMA URL
define( 'OBO_CUSTOM_ROUTES_JSON_SCHEMA_SRC', 'http://json-schema.org/draft-04/schema#' );

// CREATE SETTINGS PAGE (off for the time-being)

#require_once( plugin_dir_path( __FILE__ ) . 'class-simple-settings-page.php' );

// new Simple_Settings_Page object, or use pre-existing one
#Simple_Settings_Page::get_instance( OBO_CUSTOM_ROUTES_VERSION, OBO_CUSTOM_ROUTES_SLUG );

// CREATE CUSTOM ROUTES
function start_controllers() {

	if ( class_exists('WP_REST_Controller') ) {

		// Test: Fiscal Years
		// if (  ! class_exists('OBO_Custom_API_Test_Routes') ) {
		// 	// find code for class
		// 	require_once( plugin_dir_path( __FILE__ ) . 'class-custom-api-test-routes.php' );
		// 	// instantiate class
		// 	new OBO_Custom_API_Test_Routes( OBO_CUSTOM_ROUTES_API_VERSION, OBO_CUSTOM_ROUTES_API_NAMESPACE, OBO_CUSTOM_ROUTES_JSON_SCHEMA_SRC );


		// }

		// Expenses
		if (  ! class_exists('OBO_Custom_API_Year_Expenses_Routes') ) {
			// find code for class
			require_once( plugin_dir_path( __FILE__ ) . 'class-custom-api-year-expenses-routes.php' );
			// instantiate class
			new OBO_Custom_API_Year_Expenses_Routes( OBO_CUSTOM_ROUTES_API_VERSION, OBO_CUSTOM_ROUTES_API_NAMESPACE, OBO_CUSTOM_ROUTES_JSON_SCHEMA_SRC );


		}
		// Revenue
		if (  ! class_exists('OBO_Custom_API_Year_Revenue_Routes') ) {
			// find code for class
			require_once( plugin_dir_path( __FILE__ ) . 'class-custom-api-year-revenue-routes.php' );
			// instantiate class
			new OBO_Custom_API_Year_Revenue_Routes( OBO_CUSTOM_ROUTES_API_VERSION, OBO_CUSTOM_ROUTES_API_NAMESPACE, OBO_CUSTOM_ROUTES_JSON_SCHEMA_SRC );


		}

	}

	

}

// 
add_action( 'rest_api_init', 'start_controllers' );
