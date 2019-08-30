<?php
/*
   Plugin Name: Contactic
   Plugin URI: https://contactic.io/
   Version: 1.2.1
   Author: Contactic
   Description: Save form submissions to the database from <a href="https://wordpress.org/extend/plugins/contact-form-7/">Contact Form 7</a>, <a href="https://wordpress.org/extend/plugins/si-contact-form/">Fast Secure Contact Form</a>, <a href="https://wordpress.org/extend/plugins/jetpack/">JetPack Contact Form</a> and <a href="https://www.gravityforms.com">Gravity Forms</a>. Includes exports and short codes. | <a href="admin.php?page=ContacticPluginSubmissions">Data</a> | <a href="admin.php?page=ContacticPluginShortCodeBuilder">Shortcodes</a> | <a href="admin.php?page=ContacticPluginSettings">Settings</a> | <a href="https://contactic.io/docs/">Docs</a>
   Text Domain: contact-form-7-to-database-plus
   License: GPL3
   GitHub Plugin URI: 
   GitHub Branch: master
  */


$CTC_Plugin_minimalRequiredPhpVersion = '5.4';

/**
 * echo error message indicating wrong minimum PHP version required
 */
function CTC_Plugin_noticePhpVersionWrong() {
    global $CTC_Plugin_minimalRequiredPhpVersion;
    echo '<div class="updated fade">' .
      __('Error: plugin "Contact Form to DB Extension" requires a newer version of PHP to be running.',  'contact-form-7-to-database-extension').
            '<br/>' . __('Minimal version of PHP required: ', 'contact-form-7-to-database-extension') . '<strong>' . $CTC_Plugin_minimalRequiredPhpVersion . '</strong>' .
            '<br/>' . __('Your server\'s PHP version: ', 'contact-form-7-to-database-extension') . '<strong>' . phpversion() . '</strong>' .
         '</div>';
}

/**
 * Check the PHP version and give a useful error message if the user's version is less than the required version
 * @return boolean true if version check passed. If false, triggers an error which WP will handle, by displaying
 * an error message on the Admin page
 */
function CTC_Plugin_PhpVersionCheck() {
    global $CTC_Plugin_minimalRequiredPhpVersion;
    if (version_compare(phpversion(), $CTC_Plugin_minimalRequiredPhpVersion) < 0) {
        add_action('admin_notices', 'CTC_Plugin_noticePhpVersionWrong');
        return false;
    }
    return true;
}


/**
 * Initialize internationalization (i18n) for this plugin.
 * References:
 *      https://codex.wordpress.org/I18n_for_WordPress_Developers
 *      https://www.wdmac.com/how-to-create-a-po-language-translation#more-631
 * @return void
 */
function CTC_Plugin_i18n_init() {
    $pluginDir = dirname(plugin_basename(__FILE__));
    load_plugin_textdomain('contact-form-7-to-database-extension', false, $pluginDir . '/languages/');
}


//////////////////////////////////
// Run initialization
/////////////////////////////////

// Initialize i18n
add_action('plugins_loaded','CTC_Plugin_i18n_init');

// Run the version check.
// If it is successful, continue with initialization for this plugin
if (CTC_Plugin_PhpVersionCheck()) {
    // Only load and run the init function if we know PHP version can parse it
    include_once('CTC_Plugin_init.php');
    CTC_Plugin_init(__FILE__);
}
