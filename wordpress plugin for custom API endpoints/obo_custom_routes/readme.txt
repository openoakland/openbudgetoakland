=== Open Budget Oakland Custom API Routes ===
Contributors: Felicia Betancourt
Tags: REST API
Donate link: https://paypal.me/fmbetancourt
Requires at least: 4.0
Tested up to: 4.7.3
Stable tag: 4.7
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

== Description ==

Open Budget Oakland Custom API Routes creates custom REST API routes, which are special URLs that return information from a database table in the form of JSON rather than an HTML document. The purpose of this plugin is to expose the details in the city budget to public scrutiny. Of course, it could easily be adapted to other purposes.

== Installation ==

1. Upload obo_custom_routes.zip to the "/wp-content/plugins/" directory.
2. Activate the plugin through the "Plugins" menu in WordPress.

== Frequently Asked Questions ==

= Do I need to use the WordPress REST API plugin in conjunction with this plugin? =
As of WordPress 4.7.0, no other plugin is required. However, if your version of WordPress is earlier than that, you must also install and activate the REST API plugin in order for this one to work.

= Can I use this plugin with custom database tables?
Absolutely!

== Changelog ==

= 0.0.1 =

* Initial release using WP_REST_Controller interface from release-2-0-beta-13-1 branch of WP-API repo on GitHub

= 0.5.0 =

* 5 endpoints for accessing expense data from the budget table are now in place.

= 0.5.1 =

* Improve documentation

= 0.6.0 =

Add ability to expose revenue items, in addition to expenses

= 0.6.1 =

Fix aggregation routine for some endpoints. This permits correct data to be transmitted.

== Developer ==

The developer can be contacted via <a href="mailto:info@go-firefly.com?subject='Custom API Routes plugin inquiry'">email</a>

