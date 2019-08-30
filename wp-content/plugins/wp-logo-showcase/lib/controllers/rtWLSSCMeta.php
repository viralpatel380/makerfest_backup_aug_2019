<?php
/**
 * ShortCode Meta field Class
 *
 * This will generate the meta field for ShortCode generator post type
 *
 * @package WP_LOGO_SHOWCASE
 * @since 1.0
 * @author RadiusTheme
 */

if ( ! class_exists( 'rtWLSSCMeta' ) ):
	/**
	 *
	 */
	class rtWLSSCMeta {

		function __construct() {
			add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
			add_action( 'save_post', array( $this, 'save_team_sc_meta_data' ), 10, 3 );
			add_action( 'edit_form_after_title', array( $this, 'wls_sc_after_title' ) );
			add_action( 'admin_init', array( $this, 'rt_wls_pro_remove_all_meta_box' ) );
			add_filter( 'manage_edit-wlshowcasesc_columns', array( $this, 'arrange_wl_showcase_sc_columns' ) );
			add_action( 'manage_wlshowcasesc_posts_custom_column', array(
				$this,
				'manage_wl_showcase_sc_columns'
			), 10, 2 );
		}


		/**
		 * This will add input text field for shortCode
		 *
		 * @param $post
		 */
		function wls_sc_after_title( $post ) {
			global $rtWLS;
			if ( $rtWLS->shortCodePT !== $post->post_type ) {
				return;
			}

			$html = null;
			$html .= '<div class="postbox" style="margin-bottom: 0;"><div class="inside">';
			$html .= '<p><input type="text" onfocus="this.select();" readonly="readonly" value="[logo-showcase id=&quot;' . $post->ID . '&quot; title=&quot;' . $post->post_title . '&quot;]" class="large-text code rt-code-sc">
            <input type="text" onfocus="this.select();" readonly="readonly" value="&#60;&#63;php echo do_shortcode( &#39;[logo-showcase id=&quot;' . $post->ID . '&quot; title=&quot;' . $post->post_title . '&quot;]&#39; ); &#63;&#62;" class="large-text code rt-code-sc">
            </p>';
			$html .= '</div></div>';
			echo $html;
		}

		/**
		 * Arrange the shortCode listing column
		 *
		 * @param $columns
		 *
		 * @return array
		 */
		public function arrange_wl_showcase_sc_columns( $columns ) {
			$shortcode = array( 'wls_short_code' => __( 'Shortcode', 'tlp-team-pro' ) );

			return array_slice( $columns, 0, 2, true ) + $shortcode + array_slice( $columns, 1, null, true );
		}

		public function manage_wl_showcase_sc_columns( $column ) {
			switch ( $column ) {
				case 'wls_short_code':
					echo '<input type="text" onfocus="this.select();" readonly="readonly" value="[logo-showcase id=&quot;' . get_the_ID() . '&quot; title=&quot;' . get_the_title() . '&quot;]" class="large-text code rt-code-sc">';
					break;
				default:
					break;
			}
		}

		/**
		 *  Remove all unwanted meta box
		 */
		function rt_wls_pro_remove_all_meta_box() {
			if ( is_admin() ) {
				global $rtWLS;
				add_filter( "get_user_option_meta-box-order_{$rtWLS->shortCodePT}", array(
					$this,
					'remove_all_meta_boxes_wls_sc'
				) );
			}
		}

		/**
		 * Add only custom meta box
		 * @return array
		 */
		function remove_all_meta_boxes_wls_sc() {
			global $wp_meta_boxes, $rtWLS;
			$publishBox                           = $wp_meta_boxes[ $rtWLS->shortCodePT ]['side']['core']['submitdiv'];
			$scBox                                = $wp_meta_boxes[ $rtWLS->shortCodePT ]['normal']['high'][ $rtWLS->shortCodePT . '_sc_settings_meta' ];
			$scInfoBox                            = $wp_meta_boxes[ $rtWLS->shortCodePT ]['side']['low'][ $rtWLS->shortCodePT . '_sc_pro_info' ];
			$wp_meta_boxes[ $rtWLS->shortCodePT ] = array(
				'side'   => array(
					'core' => array( 'submitdiv' => $publishBox ),
					'low' => array( $rtWLS->shortCodePT . '_sc_pro_info' => $scInfoBox )
				),
				'normal' => array(
					'high' => array(
						$rtWLS->shortCodePT . '_sc_settings_meta' => $scBox
					)
				)
			);

			return array();
		}

		/**
		 *  Add script for the shortCode generate page only
		 */
		function admin_enqueue_scripts() {

			global $pagenow, $typenow, $rtWLS;
			// validate page
			if ( ! in_array( $pagenow, array( 'post.php', 'post-new.php', 'edit.php' ) ) ) {
				return;
			}
			if ( $typenow != $rtWLS->shortCodePT ) {
				return;
			}

			// scripts
			wp_enqueue_script( array(
				'jquery',
				'rt-actual-height-js',
				'wp-color-picker',
				'rt-slick',
				'rt-select2',
				'rt-wls-admin',
			) );

			// styles
			wp_enqueue_style( array(
				'wp-color-picker',
				'rt-select2',
				'rt-wls-admin',
			) );

			$nonce = wp_create_nonce( $rtWLS->nonceText() );
			wp_localize_script( 'rt-wls-admin', 'wls',
				array(
					'nonceID' => $rtWLS->nonceID(),
					'nonce'   => $nonce,
					'ajaxurl' => admin_url( 'admin-ajax.php' )
				) );

			add_action( 'admin_head', array( $this, 'admin_head' ) );

		}

		/**
		 * Create the custom meta box for ShortCode post type
		 */
		function admin_head() {

			global $rtWLS;
			add_meta_box(
				$rtWLS->shortCodePT . '_sc_settings_meta',
				__( 'Short Code Generator', 'wp-logo-showcase' ),
				array( $this, 'wls_sc_settings_selection' ),
				$rtWLS->shortCodePT,
				'normal',
				'high' );


			add_meta_box(
				$rtWLS->shortCodePT . '_sc_pro_info',
				__( 'Wp Logo Showcase Pro Info', 'wp-logo-showcase' ),
				array( $this, 'wls_sc_pro_information' ),
				$rtWLS->shortCodePT,
				'side',
				'low' );
		}


		/**
		 * Meta info function
		 * @internal param $post
		 */
		function wls_sc_pro_information() {
			?>
			<ol>
				<li>Isotope layout</li>
				<li>Carousel Slider with multiple features.</li>
				<li>Custom Logo Re-sizing.</li>
				<li>Drag & Drop Layout builder.</li>
				<li>Drag & Drop Logo ordering.</li>
				<li>Custom Link for each Logo.</li>
				<li>Category wise Isotope Filtering.</li>
				<li>Tooltip Enable/Disable option.</li>
				<li>Box Highlight Enable/Disable.</li>
				<li>Center Mode available.</li>
				<li>RTL Supported.</li>
			</ol>
			<p><a target="_blank" href="https://codecanyon.net/item/wp-logo-showcase-responsive-wp-plugin/16396329?ref=RadiusTheme" class="rt-pro-link">Get Pro Version</a></p>
			<?php
		}

		/**
		 * Setting Sections
		 *
		 * @param $post
		 */
		function wls_sc_settings_selection( $post ) {
			global $rtWLS;
			wp_nonce_field( $rtWLS->nonceText(), $rtWLS->nonceID() );
			$html = null;
			$html .= '<div class="rt-tab-container">';
			$html .= '<ul class="rt-tab-nav">
                            <li><a href="#sc-wls-layout">' . __( 'Layout Settings', 'wp-logo-showcase' ) . '</a></li>
                            <li><a href="#sc-wls-filter">' . __( 'Logo Filtering', 'wp-logo-showcase' ) . '</a></li>
                            <li><a href="#sc-wls-field-selection">' . __( 'Field Selection', 'wp-logo-showcase' ) . '</a></li>
                            <li><a href="#sc-wls-style">' . __( 'Styling', 'wp-logo-showcase' ) . '</a></li>
                          </ul>';
			$html .= '<div id="sc-wls-layout" class="rt-tab-content">';
			$html .= $this->rt_wls_sc_layout_meta();
			$html .= '</div>';

			$html .= '<div id="sc-wls-filter" class="rt-tab-content">';
			$html .= $this->rt_wls_sc_filter_meta();
			$html .= '</div>';

			$html .= '<div id="sc-wls-field-selection" class="rt-tab-content">';
			$html .= $this->rt_wls_sc_field_selection_meta();
			$html .= '</div>';

			$html .= '<div id="sc-wls-style" class="rt-tab-content">';
			$html .= $this->rt_wls_sc_style_meta( $post );
			$html .= '</div>';
			$html .= '</div>';

			echo $html;
		}

		/**
		 * Filter Section
		 * @return null|string
		 */
		function rt_wls_sc_filter_meta() {
			global $rtWLS;
			$html = null;
			$html .= "<div class='rt-sc-meta-field-holder'>";
			$html .= $rtWLS->rtFieldGenerator( $rtWLS->scFilterMetaFields(), true );
			$html .= "</div>";

			return $html;
		}

		/**
		 * Filter Section
		 * @return null|string
		 */
		function rt_wls_sc_field_selection_meta() {
			global $rtWLS;
			$html = null;
			$html .= "<div class='rt-sc-meta-field-holder'>";
			$html .= $rtWLS->rtFieldGenerator( $rtWLS->scFieldSelectionMetaFields(), true );
			$html .= "</div>";

			return $html;
		}

		/**
		 * Layout section
		 * @return null|string
		 */
		function rt_wls_sc_layout_meta() {
			global $rtWLS;
			$html = null;
			$html .= "<div class='rt-sc-meta-field-holder'>";
			$html .= $rtWLS->rtFieldGenerator( $rtWLS->scLayoutMetaFields(), true );
			$html .= "</div>"; // End
			return $html;
		}


		/**
		 * Style section
		 *
		 * @param $post
		 *
		 * @return null|string
		 */
		function rt_wls_sc_style_meta() {
			global $rtWLS;
			$html = null;
			$html .= "<div class='rt-sc-meta-field-holder'>";
			$html .= $rtWLS->rtFieldGenerator( $rtWLS->scStyleFields(), true );
			$html .= "</div>"; // End
			return $html;

		}

		/**
		 * Save all the meta value for shortCode meta field
		 *
		 * @param $post_id
		 * @param $post
		 * @param $update
		 *
		 * @return mixed
		 */
		function save_team_sc_meta_data( $post_id, $post, $update ) {

			if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
				return;
			}
			global $rtWLS;
			if ( ! $rtWLS->verifyNonce() ) {
				return $post_id;
			}
			if ( $rtWLS->shortCodePT != $post->post_type ) {
				return $post_id;
			}

			$mates = $rtWLS->wlsScMetaNames();
			foreach ( $mates as $field ) {
				$rValue = ! empty( $_REQUEST[ $field['name'] ] ) ? $_REQUEST[ $field['name'] ] : null;
				$value  = $rtWLS->sanitize( $field, $rValue );
				if ( empty( $field['multiple'] ) ) {
					update_post_meta( $post_id, $field['name'], $value );
				} else {
					delete_post_meta( $post_id, $field['name'] );
					if ( is_array( $value ) && ! empty( $value ) ) {
						foreach ( $value as $item ) {
							add_post_meta( $post_id, $field['name'], $item );
						}
					}
				}
			}

		}
	}
endif;