<?php

class ISEPB_Slider_Manager{

	public function __construct(){
		add_shortcode('isepb_image_slider', array($this, 'image_slider'));
	}

	public function image_slider($slider_settings){
        global $isepb,$isepb_slider_params;

        wp_enqueue_script('isepb-jssor-slides-script');
        wp_enqueue_script('isepb-front');

        $isepb_slider_params['slider_width'] = isset($slider_settings['slider_width']) ? (int) $slider_settings['slider_width'] : '600';
        $isepb_slider_params['slider_height'] = isset($slider_settings['slider_height']) ? (int) $slider_settings['slider_height'] : '300';
    
        $transition = isset($slider_settings['transition']) ? $slider_settings['transition'] : 'fade';
        $isepb_slider_params['transition_effect'] = isepb_transitions_list($transition);
        $isepb_slider_params['auto_play'] = ($slider_settings['auto_play'] == 'enabled') ? 'true' : 'false';

        $isepb_slider_params['show_arrows'] = isset($slider_settings['show_arrows']) ? $slider_settings['show_arrows'] : 'enabled';
        $isepb_slider_params['arrow_type']  = isset($slider_settings['arrow_type']) ? $slider_settings['arrow_type'] : 'a01';
        $isepb_slider_params['slider_type']  = isset($slider_settings['slider_type']) ? $slider_settings['slider_type'] : 'image_slider';

        $isepb_slider_params['number_of_slides']  = isset($slider_settings['number_of_slides']) ? $slider_settings['number_of_slides'] : '3';
        $isepb_slider_params['slide_width']  = isset($slider_settings['slide_width']) ? $slider_settings['slide_width'] : '200';
        $isepb_slider_params['autoplay_interval']  = isset($slider_settings['autoplay_interval']) ? $slider_settings['autoplay_interval'] : '1';
        $isepb_slider_params['autoplay_steps']  = isset($slider_settings['autoplay_steps']) ? $slider_settings['autoplay_steps'] : '4';
  
        $isepb_slider_params['thumbnail_visibility']  = isset($slider_settings['thumbnail_visibility']) ? $slider_settings['thumbnail_visibility'] : '2';
        $isepb_slider_params['thumbnail_gallery_design']  = isset($slider_settings['thumbnail_gallery_design']) ? $slider_settings['thumbnail_gallery_design'] : 'inside';
        $isepb_slider_params['thumbnail_back_color']  = isset($slider_settings['thumbnail_back_color']) ? $slider_settings['thumbnail_back_color'] : '';

        $isepb_slider_params['id_int'] = isset($slider_settings['id_int']) ? $slider_settings['id_int'] : '';

        $isepb_slider_params['slider_images'] = isset($slider_settings['slider_images']) ? explode(',',$slider_settings['slider_images']) : array();

        $upload_dir = wp_upload_dir();
        $isepb_slider_params['upload_dir_url'] = $upload_dir['baseurl']."/";
        $isepb_slider_params['upload_sub_dir_url'] = $upload_dir['baseurl'].$upload_dir['subdir']."/";

        // ADd template support for each slider type
        ob_start();

        $display = '';
        $isepb_slider_params['additional_options']  = $this->additional_options($isepb_slider_params);
        switch ($isepb_slider_params['slider_type']) {
            case 'image_slider':
                $isepb->template_loader->get_template_part('image-slider','default');
                $isepb->template_loader->get_template_part('slider-init','default');
                $display = ob_get_clean();
                break;
            
            case 'vertical_image_slider':
                $isepb->template_loader->get_template_part('image-slider','default');
                $isepb->template_loader->get_template_part('slider-init','default');
                $display .= ob_get_clean();
                break;

            case 'image_gallery':
                $isepb->template_loader->get_template_part('image-gallery','default');
                $isepb->template_loader->get_template_part('slider-init','default');
                $display .= ob_get_clean();
                break;

            case 'thumbnail_slider':
                $isepb->template_loader->get_template_part('image-slider','default');
                $isepb->template_loader->get_template_part('slider-init','default');
                $display .= ob_get_clean();
                break;

            case 'tab_slider':
                $isepb->template_loader->get_template_part('tab-slider','default');
                $isepb->template_loader->get_template_part('slider-init','default');
                $display .= ob_get_clean();
                break;

            default:
                # code...
                break;
        }

        /* Logo/ Thumbnail Slider */
        $html = $display;
        return $html;
    }

    public function additional_options($isepb_slider_params){
        extract($isepb_slider_params);


        $additional_options = '';
        switch ($slider_type) {
            case 'image_slider':
                $additional_options = '';
                break;            
            case 'image_gallery':
                $additional_options = '$ThumbnailNavigatorOptions: {
                                            $Class: $JssorThumbnailNavigator$,
                                            $Cols: 10,
                                            $SpacingX: 8,
                                            $SpacingY: 8,
                                            $Align: 360,
                                            $ChanceToShow:'.$thumbnail_visibility.',
                                            //$Rows : 2
                                          }';
                break;

            default:
                # code...
                break;
        }

        $additional_options  = apply_filters('isepb_slider_additional_options',$additional_options, array('slider_type' => $slider_type));

        return $additional_options;
    }
}