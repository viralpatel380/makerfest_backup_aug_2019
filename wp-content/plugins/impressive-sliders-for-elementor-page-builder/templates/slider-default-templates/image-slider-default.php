<?php
	global $isepb,$isepb_slider_params;
	extract($isepb_slider_params);

?>

<div id='isepb-slider-container-<?php echo $id_int; ?>' class='isepb-slider-active jssor_slider_outer_container' style='position: relative; top: 0px; left: 0px; width:<?php echo $slider_width; ?>px;height:<?php echo $slider_height; ?>px;' >
        
    <div u='slides' class='jssor_slider_slides' style='width:<?php echo $slider_width; ?>px;height:<?php echo $slider_height; ?>px;cursor:default;overflow:hidden;' >
        <?php foreach($slider_images as $attach_id){
                if($attach_id != ''){
                    $attachment = wp_get_attachment_metadata( $attach_id );
                    // $thumbnail = isset($attachment['sizes']['medium']['file']) ? $upload_sub_dir_url.$attachment['sizes']['medium']['file'] : $upload_dir_url.$attachment['file'];
        ?>
                    <div class='isepb-front-slider-single'>
                        <img data-u='image' src='<?php echo $upload_dir_url.$attachment['file']; ?>' alt='<?php echo $attachment['image_meta']['title']; ?>' >
                        
                    </div>
     
        <?php
            }
        }
        ?>
    </div>


	<?php if($show_arrows == 'enabled'){ ?>
        <span u='arrowleft' class='jssor<?php echo $arrow_type; ?>l' style='top: <?php echo  (int) ($slider_height/2); ?>px; left: 8px;'></span>        
        <span u='arrowright' class='jssor<?php echo $arrow_type; ?>r' style='top: <?php echo  (int) ($slider_height/2); ?>px; right: 8px;'></span>
	<?php } ?>

</div>