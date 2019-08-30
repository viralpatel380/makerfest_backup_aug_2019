<?php
namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Widget_ISEPB_Image_Slider extends Widget_Base {

	public function get_name() {
		return 'isepb-image-slider';
	}

	public function get_title() {
		return __( 'Impressive Slider', 'isepb' );
	}

	public function get_icon() {
		return 'eicon-gallery-grid';
	}

	public function get_categories() {
		return [ 'general-elements' ];
	}

	protected function _register_controls() {
		$this->start_controls_section(
			'section_isepb_slider',
			[
				'label' => __( 'Impressive Slider', 'isepb' ),
			]
		);

		$this->add_control(
			'isepb_images_list',
			[
				'label' => __( 'Add Images', 'isepb' ),
				'type' => Controls_Manager::GALLERY,
			]
		);

		$slider_type = array('image_slider' => __('Image Slider','isepb'),
			'image_gallery' => __('Image Gallery','isepb'));

		$this->add_control(
			'isepb_slider_type',
			[
				'label' => __( 'Slide Type', 'isepb' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'enabled',
				'options' => $slider_type,
			]
		);

		$this->add_control(
			'isepb_slider_width',
			[
				'label' => __( 'Slider Width', 'isepb' ),
				'type' => Controls_Manager::TEXT,
				'placeholder' => __( 'Enter Slider Width', 'isepb' ),
				'default' => '',
				'label_block' => true
			]
		);

		$this->add_control(
			'isepb_slider_height',
			[
				'label' => __( 'Slider Height', 'isepb' ),
				'type' => Controls_Manager::TEXT,
				'placeholder' => __( 'Enter Slider Height', 'isepb' ),
				'default' => '',
				'label_block' => true
			]
		);

		$autoplay = array('enabled' => __('Enabled','isepb'),'disabled' => __('Disabled','isepb'));
		$this->add_control(
			'isepb_slider_autoplay',
			[
				'label' => __( 'Autoplay', 'isepb' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'enabled',
				'options' => $autoplay,
			]
		);

		$autoplay_transition = isepb_transitions();
		$this->add_control(
			'isepb_slider_autoplay_transition',
			[
				'label' => __( 'Autoplay Transition', 'isepb' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'fade',
				'options' => $autoplay_transition,
			]
		);

		$navigation_arrows = array('enabled' => __('Enabled','isepb'),'disabled' => __('Disabled','isepb'));
		$this->add_control(
			'isepb_slider_navigation_arrows',
			[
				'label' => __( 'Navigation Arrows', 'isepb' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'enabled',
				'options' => $navigation_arrows,
			]
		);

		$navigation_arrow_types = array('a01' => __('Design 1','isepb'),
			'a02' => __('Design 2','isepb'));
		$this->add_control(
			'isepb_slider_navigation_arrow_type',
			[
				'label' => __( 'Arrow Type', 'isepb' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'a01',
				'options' => $navigation_arrow_types,
			]
		);

		$this->end_controls_section();
	}

	protected function render() {
		$settings = $this->get_settings();

		if ( ! $settings['isepb_images_list'] ) {
			return;
		}

		$id_int = substr( $this->get_id_int(), 0, 3 );
		$this->add_render_attribute( 'shortcode', 'id_int', $id_int );

		$ids = wp_list_pluck( $settings['isepb_images_list'], 'id' );
		$this->add_render_attribute( 'shortcode', 'slider_images', implode( ',', $ids ) );

		if ( isset($settings['isepb_slider_width']) &&  $settings['isepb_slider_width'] != '' ) {
			$this->add_render_attribute( 'shortcode', 'slider_width', $settings['isepb_slider_width'] );
		}
		if ( isset($settings['isepb_slider_height'] ) && $settings['isepb_slider_height'] != '') {
			$this->add_render_attribute( 'shortcode', 'slider_height', $settings['isepb_slider_height'] );
		}
		if ( isset($settings['isepb_slider_autoplay_transition'] ) ) {
			$this->add_render_attribute( 'shortcode', 'transition', $settings['isepb_slider_autoplay_transition'] );
		}		
		
		if ( isset($settings['isepb_slider_type'] ) ) {
			$this->add_render_attribute( 'shortcode', 'slider_type', $settings['isepb_slider_type'] );
		}
		if ( isset($settings['isepb_slider_navigation_arrows']  )) {
			$this->add_render_attribute( 'shortcode', 'show_arrows', $settings['isepb_slider_navigation_arrows'] );
		}
		if ( isset($settings['isepb_slider_navigation_arrow_type']  )) {
			$this->add_render_attribute( 'shortcode', 'arrow_type', $settings['isepb_slider_navigation_arrow_type'] );
		}
		
		if ( isset($settings['isepb_slider_autoplay'] ) ) {
			$this->add_render_attribute( 'shortcode', 'auto_play', $settings['isepb_slider_autoplay'] );
		}
		if ( isset($settings['isepb_autoplay_interval'] ) ) {
			$this->add_render_attribute( 'shortcode', 'autoplay_interval', $settings['isepb_autoplay_interval'] );
		}
		if ( isset($settings['isepb_autoplay_steps']  )) {
			$this->add_render_attribute( 'shortcode', 'autoplay_steps', $settings['isepb_autoplay_steps'] );
		}
		if ( isset($settings['isepb_thumbnail_visibility'] ) ) {
			$this->add_render_attribute( 'shortcode', 'thumbnail_visibility', $settings['isepb_thumbnail_visibility'] );
		}
		if ( isset($settings['isepb_thumbnail_gallery_design'] ) ) {
			$this->add_render_attribute( 'shortcode', 'thumbnail_gallery_design', $settings['isepb_thumbnail_gallery_design'] );
		}
		if ( isset($settings['isepb_thumbnail_back_color'] ) ) {
			$this->add_render_attribute( 'shortcode', 'thumbnail_back_color', $settings['isepb_thumbnail_back_color'] );
		}
		
		?>
		<div class="isepb-image-slider">
			<?php
			echo do_shortcode( '[isepb_image_slider ' . $this->get_render_attribute_string( 'shortcode' ) . ']' );
			?>
		</div>
		<?php
	}
}

Plugin::instance()->widgets_manager->register_widget_type( new Widget_ISEPB_Image_Slider() );