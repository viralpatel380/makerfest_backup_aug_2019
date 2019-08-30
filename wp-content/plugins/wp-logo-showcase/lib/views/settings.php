<?php global $rtWLS; ?>

<div class="wrap">
	<div id="upf-icon-edit-pages" class="icon32 icon32-posts-page"><br/></div>
	<h2><?php _e( 'WP Logo Showcase Settings', 'wp-services-showcase' ); ?></h2>
	<h3><?php _e( 'General settings', 'wp-services-showcase' ); ?>
		<a style="margin-left: 15px; font-size: 15px;"
		   href="https://www.radiustheme.com/setup-wp-logo-showcase-free-version-wordpress/"
		   target="_blank"><?php _e( 'Documentation', 'wp-services-showcase' ) ?></a>
	</h3>

	<div class="rt-setting-wrapper">
		<div class="rt-response"></div>
		<div class="tlp-content-holder">
			<div class="tch-left">
				<form id="rt-wls-settings-form" onsubmit="rtWLSSettings(this); return false;">

					<div class="rt-tab-container">
						<ul class="rt-tab-nav">
							<li><a href="#s-wls-general"><?php _e( 'General Settings', 'wp-services-showcase' ); ?></a>
							</li>
							<li><a href="#s-wls-custom-css"><?php _e( 'Custom CSS', 'wp-services-showcase' ); ?></a>
							</li>
						</ul>
						<div id="s-wls-general" class="rt-setting-holder rt-tab-content">
							<?php echo $rtWLS->rtFieldGenerator( $rtWLS->rtWLSGeneralSettings(), true ); ?>
						</div>
						<div id="s-wls-custom-css" class="rt-setting-holder rt-tab-content">
							<?php echo $rtWLS->rtFieldGenerator( $rtWLS->rtWLSCustomCss(), true ); ?>
						</div>
					</div>

					<p class="submit"><input type="submit" name="submit" class="button button-primary rtSaveButton"
					                         value="Save Changes"></p>

					<?php wp_nonce_field( $rtWLS->nonceText(), $rtWLS->nonceId() ); ?>
				</form>

				<div class="rt-response"></div>
			</div>
			<div class="tch-right">
				<div id="pro-feature" class="postbox">
					<div class="handlediv" title="Click to toggle"><br></div>
					<h3 class="hndle ui-sortable-handle"><span>WP Logo Showcase Pro Features</span></h3>
					<div class="inside">
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
						<p><a target="_blank" href="https://codecanyon.net/item/wp-logo-showcase-responsive-wp-plugin/16396329?ref=RadiusTheme"
						          class="pro-button-link" target="_blank">Get Pro Version</a></p>
						<p class="rt-help-link"><a class="button-primary" target="_blank"
						                           href="http://demo.radiustheme.com/wordpress/freeplugins/logo-showcase/"
						                           target="_blank"><?php _e( 'Demo', 'wp-services-showcase' ); ?></a> <a
								class="button-primary" target="_blank" href="https://www.radiustheme.com/setup-wp-logo-showcase-free-version-wordpress/"
								target="_blank"><?php _e( 'Documentation', 'wp-services-showcase' ); ?></a></p>
					</div>
				</div>
			</div>
		</div>
	</div>

</div>
