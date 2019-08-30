<?php
/**
 * Plugin Name: Contact Form 7 Skins
 * Plugin URI:  http://cf7skins.com
 * Description: Adds drag & drop Visual Editor with Templates & Styles to Contact Form 7. Requires Contact Form 7.
 * Version:     2.0.2
 * Author:      Neil Murray
 * Author URI:  http://cf7skins.com
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: contact-form-7-skins
 * Domain Path: /languages
 * 
 * @package cf7skins
 * @author Neil Murray
 * @copyright Copyright (c) 2014-2018 Neil Murray
 */

/**
 * Prevent direct access.
 * 
 * @since 0.1.0
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Define global constants.
 * 
 * @since 0.1.0
 */
define( 'CF7SKINS_VERSION', '2.0.2' );
define( 'CF7SKINS_OPTIONS', 'cf7skins' ); // Database option names
define( 'CF7SKINS_TEXTDOMAIN', 'contact-form-7-skins' );
define( 'CF7SKINS_FEATURE_FILTER', false ); // @since 0.4.0
define( 'CF7SKINS_PATH', plugin_dir_path( __FILE__ ) );
define( 'CF7SKINS_URL', plugin_dir_url( __FILE__ ) );
define( 'CF7SKINS_STYLES_PATH', CF7SKINS_PATH . 'skins/styles/' );
define( 'CF7SKINS_STYLES_URL', CF7SKINS_URL . 'skins/styles/' );
define( 'CF7SKINS_TEMPLATES_PATH', CF7SKINS_PATH . 'skins/templates/' );
define( 'CF7SKINS_TEMPLATES_URL', CF7SKINS_URL . 'skins/templates/' );
define( 'CF7SKINS_UPDATE_URL', 'http://cf7skins.com' ); // @since 0.7.0

/** 
 * WP Options & Metas.
 *
 * Options (stored at wp_options table):
 *	'cf7skins'                      (array)     store all settings page fields. Uses CF7SKINS_OPTIONS variable name.
 *	'cf7skins_version_installed'    (string)    hold current installed version
 *	'cf7skins_activated'            (bool)      option for checking if plugin is activated by user
 *	'cf7skins_get_version'          (array)     plugins version data from remote site using EDD plugin updater
 *	'cf7skins_activation'           (array)     plugins activation data from remote site using EDD plugin updater
 *	'cf7skins_deactivation'         (array)     plugins activation data from remote site using EDD plugin updater
 *	'cf7skins_license_status'       (string)    plugin license activation status
 *
 * Metas (stored at wp_postmeta table):
 *		'cf7s_template' - (string) selected skins template
 *		'cf7s_style' - (string) selected skins style
 *		'cf7s_postbox' - (string) store expand/collapse state for skins metabox
 *	
 * NOTE: All options are deleted in uninstall.php if is enabled from settings page
 * 
 * @since 1.1.2
 */

/**
 * Plugin initial hooks.
 * 
 * @since 0.1.0
 */
register_activation_hook( __FILE__, 'cf7skins_activation_hook' );
add_action( 'admin_init', 'cf7skins_on_activation' );
add_action( 'upgrader_process_complete', 'cf7skins_upgrader_process_complete', 1, 2 );
add_action( 'plugins_loaded', 'cf7skins_plugin_loaded', 1 );

/**
 * Create option for activation check.
 * 
 * @since 0.2.0
 */
function cf7skins_activation_hook() {
	add_option( 'cf7skins_activated', true );
}

/**
 * Activation checks.
 * 
 * @since 0.2.0
 */
function cf7skins_on_activation() {
	
	// Check if Contact Form 7 is installed
	if ( ! defined( 'WPCF7_VERSION' ) ) {
		return;
	}
	
	// Return if activation option does not exist after plugin was activated
	if ( ! get_option( 'cf7skins_activated' ) ) {
		return;
	}
	
	// Add plugin version to the database for further upgrade checking
	// @since 0.6.1
	update_option( 'cf7skins_version_installed', CF7SKINS_VERSION );
	
	if ( current_user_can( 'activate_plugins' ) && is_admin() ) {
		delete_option( 'cf7skins_activated' );  // delete activation checker, need no more redirects
	}
}

/**
 * Upgrade plugin version number after upgrading.
 * 
 * @see https://github.com/WordPress/WordPress/blob/master/wp-admin/includes/class-wp-upgrader.php#L615
 * 
 * @param $instance	WP upgrader class object
 * @param (array) $args Example:
 *		Single update: array (
 *			[plugin] => contact-form-7-skins/index.php
 *			[type] => plugin
 *			[action] => update
 *		)
 *		Bulk update: array(
 *			[action] => update
 *			[type] => plugin
 *			[bulk] => 1
 *			[plugins] => array(
 *					[0] => akismet/akismet.php
 *					[1] => contact-form-7-skins/index.php
 *				)
 *		)
 * 
 * @since 0.6.1
 */
function cf7skins_upgrader_process_complete( $instance, $args ) {
	
	// Bail early if this is not plugin update process
	if ( 'update' != $args['action'] || 'plugin' != $args['type'] ) {
		return;
	}
	
	// Do version update if this is a single update and the plugin file is $args['plugin']
	if ( ! isset( $args['bulk'] ) && plugin_basename( __FILE__ ) == $args['plugin'] ) {
		add_option( 'cf7skins_activated', true );
	}
	
	// Do version update if this is a bulk update and the plugin file is in the $args['plugins']
	if ( isset( $args['bulk'] ) && in_array( plugin_basename( __FILE__ ), $args['plugins'] ) ) {
		add_option( 'cf7skins_activated', true );
	}
}

/**
 * Initialize the plugin.
 * 
 * @since 0.1.0
 */
function cf7skins_plugin_loaded() {
	
	// Load plugin translation
	load_plugin_textdomain( CF7SKINS_TEXTDOMAIN, false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
	
	// Check if CF7 is installed
	if ( defined( 'WPCF7_VERSION' ) ) {
		
		require_once( CF7SKINS_PATH . 'includes/skin.php' );
		require_once( CF7SKINS_PATH . 'includes/template.php' );
		require_once( CF7SKINS_PATH . 'includes/style.php' );
		require_once( CF7SKINS_PATH . 'includes/cf7-connect.php' );
		
		if ( is_admin() ) {
			require_once( CF7SKINS_PATH . 'includes/admin.php' );
			require_once( CF7SKINS_PATH . 'includes/admin-visual.php' ); // @since 2.0.0
			require_once( CF7SKINS_PATH . 'includes/license.php' );
			require_once( CF7SKINS_PATH . 'includes/tab.php' );
			require_once( CF7SKINS_PATH . 'includes/settings.php' );
			require_once( CF7SKINS_PATH . 'includes/admin-notice.php' );
			
			cf7s_fs(); // init Freemius
			do_action( 'cf7s_fs_loaded' ); // signal that SDK was initiated.
		} else {
			require_once( CF7SKINS_PATH . 'includes/front-visual.php' ); // @since 2.0.0
		}

		if ( ! class_exists( 'EDD_SL_Plugin_Updater' ) ) {
			require_once( CF7SKINS_PATH . 'includes/EDD_SL_Plugin_Updater.php' );
		}
	
	// Display admin notifications
	} else {
		add_action( 'admin_notices', 'cf7skins_require_admin_message' );
	}
}

/**
 * Display admin notifications.
 * 
 * @since 0.1.0
 */
function cf7skins_require_admin_message() {
	if ( current_user_can( 'manage_options' ) ) {
		
		$message = '';
		
		if ( ! defined( 'WPCF7_VERSION' ) ) {
			$message = sprintf( __( '<a href="%s">Contact Form 7</a> must be installed to use this plugin.' , CF7SKINS_TEXTDOMAIN ), 'https://wordpress.org/plugins/contact-form-7/' ) . '<br />';
		}
		echo "<div id='cf7skins-message' class='notice notice-warning'>
				<p><strong>Contact Form 7 Skins</strong><br />$message</p>
			</div>";
	}
}

/**
 * Add Freemius/wordpress-sdk
 * 
 * @since 1.2.2
 */
function cf7s_fs() {
    global $cf7s_fs;

    if ( ! isset( $cf7s_fs ) ) {
        // Include Freemius SDK.
        require_once dirname(__FILE__) . '/freemius/start.php';

        $cf7s_fs = fs_dynamic_init( array(
            'id'                  => '1656',
            'slug'                => 'contact-form-7-skins',
            'type'                => 'plugin',
            'public_key'          => 'pk_cc0be6b0925b0cbff144d85e42916',
            'is_premium'          => false,
            'has_addons'          => false,
            'has_paid_plans'      => false,
            'menu'                => array(
                'slug'           => 'cf7skins',
                'override_exact' => true, // always start at getting-started tab @since 2.0.0
                'first-path'     => 'admin.php?page=cf7skins&tab=getting-started',
                'account'        => false,
                'contact'        => false,
                'support'        => false,
                'parent'         => array(
                    'slug' => 'wpcf7',
                ),
            ),
        ) );
    }

    return $cf7s_fs;
}

/**
 * Redirect to CF7 Skins Getting Started tab URL
 * Allow & Continue, will remove Freemius content for next activation and shows getting-started content.
 * Skip, will remove Freemius content but will be shown again for next activation
 * 
 * @since 2.0
 */
function cf7s_fs_settings_url() {
	return admin_url( 'admin.php?page=cf7skins&tab=getting-started' );
}

cf7s_fs()->add_filter( 'connect_url', 'cf7s_fs_settings_url' );
cf7s_fs()->add_filter( 'after_skip_url', 'cf7s_fs_settings_url' );
cf7s_fs()->add_filter( 'after_connect_url', 'cf7s_fs_settings_url' );
cf7s_fs()->add_filter( 'after_pending_connect_url', 'cf7s_fs_settings_url' );