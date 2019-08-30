<?php
/*
  Plugin Name: Impressive Sliders for Elementor Page Builder
  Plugin URI: http://wpexpertdeveloper.com/impressive-sliders-elementor-page-builder
  Description: Image slider and gallery elements for Elementor page builder using jQuery Jssor Slider.
  Version: 1.0
  Author: Rakhitha Nimesh
  Author URI: http://wpexpertdeveloper.com/
 */


// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

class ISEPB_Slider {

    private static $instance = null;

    public static function get_instance() {
        if ( ! self::$instance )
            self::$instance = new self;
        return self::$instance;
    }

    public function init(){
        global $isepb;

    	if ( ! defined( 'ISEPB_PLUGIN_DIR' ) ) {
            define( 'ISEPB_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
        }

        // Plugin Folder URL
        if ( ! defined( 'ISEPB_PLUGIN_URL' ) ) {
            define( 'ISEPB_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
        }

        require_once ISEPB_PLUGIN_DIR.'classes/class-isepb-template-loader.php';
        require_once ISEPB_PLUGIN_DIR.'classes/class-isepb-slider-manager.php';

        $isepb = new stdClass;
        $isepb->template_loader = new ISEPB_Template_Loader();
        $isepb->slider_manager = new ISEPB_Slider_Manager();


    	add_action('wp_enqueue_scripts',array( $this,'load_scripts'),9);
        add_action( 'elementor/widgets/widgets_registered', array( $this, 'widgets_registered' ) );
    }

    public function load_scripts(){
          
        wp_register_style('isepb-front-style', ISEPB_PLUGIN_URL . 'css/isepb-front.css');
        wp_enqueue_style('isepb-front-style');

        wp_register_script('isepb-front', ISEPB_PLUGIN_URL.'js/isepb-front.js', array('jquery'));
       
        wp_register_script('isepb-jssor-slides-script', ISEPB_PLUGIN_URL.'lib/jssor/jssor.slider.mini.js', array('jquery'));
        
        wp_register_script('isepb-slider-init', ISEPB_PLUGIN_URL.'js/isepb-slider-init.js', array('jquery'));
       
    }

    public function widgets_registered() {
        if(defined('ELEMENTOR_PATH') && class_exists('Elementor\Widget_Base')){
            
            require_once plugin_dir_path(__FILE__).'/functions.php';

            $widget_file = plugin_dir_path(__FILE__).'/widgets/isepb-image-slider-element.php';
            $template_file = locate_template($widget_file);
            if ( !$template_file || !is_readable( $template_file ) ) {
                $template_file = plugin_dir_path(__FILE__).'widgets/isepb-image-slider-element.php';
            }
            if ( $template_file && is_readable( $template_file ) ) {
                require_once $template_file;
            }
        }
    }
}

ISEPB_Slider::get_instance()->init();



