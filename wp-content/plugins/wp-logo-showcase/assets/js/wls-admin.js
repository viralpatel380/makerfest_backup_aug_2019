(function($){
    $(function(){
        $(".rt-tab-nav li:first-child a").trigger('click');
    });
    if($(".rt-color").length){
        $(".rt-color").wpColorPicker();
    }
    if($(".rt-select2").length){
        $(".rt-select2").select2({
            theme: "classic",
            minimumResultsForSearch: Infinity
        });
    }

    $("#wls_image_resize").on('change', function(){
            wlsImageResizeOption();
    });
    $("#wls_layout").on('change', function(){
        wlsCarouselOption();
    });

    wlsImageResizeOption();
    wlsCarouselOption();


    $(".rt-tab-nav li").on('click', 'a', function(e){
        e.preventDefault();
        var container = $(this).parents('.rt-tab-container'),
            nav = container.children('.rt-tab-nav'),
            content = container.children(".rt-tab-content"),
            $this = $(this),
            $id = $this.attr('href');
        content.hide();
        nav.find('li').removeClass('active');
        $this.parent().addClass('active');
        container.find($id).show();
    });

    function wlsImageResizeOption(){
        if($("#wls_image_resize").is(":checked")){
            $("#wls_image_width_holder, #wls_image_height_holder").show();
        }else{
            $("#wls_image_width_holder, #wls_image_height_holder").hide();
        }
    }
    function wlsCarouselOption(){
        var id = $("#wls_layout").val();
        if(id == 'carousel-layout'){
            $(".wls_column_holder").hide();
            $(".wls_carousel_options_holder").show();
        }else{
            $(".wls_column_holder").show();
            $(".wls_carousel_options_holder").hide();
        }
    }
})(jQuery);

( function( global, $ ) {
    var editor,
        syncCSS = function() {
            wlsSyncCss();
        },
        loadAce = function() {
            $('.rt-custom-css').each(function(){
                var id = $(this).find('.custom-css').attr('id');
                editor = ace.edit( id );
                global.safecss_editor = editor;
                editor.getSession().setUseWrapMode( true );
                editor.setShowPrintMargin( false );
                editor.getSession().setValue( $(this).find('.custom_css_textarea').val() );
                editor.getSession().setMode( "ace/mode/css" );
            });

            jQuery.fn.spin&&$( '.custom_css_container' ).spin( false );
            $( '#post' ).submit( syncCSS );
        };
    if ( $.browser.msie&&parseInt( $.browser.version, 10 ) <= 7 ) {
        $( '.custom_css_container' ).hide();
        $( '.custom_css_textarea' ).show();
        return false;
    } else {
        $( global ).load( loadAce );
    }
    global.aceSyncCSS = syncCSS;
} )( this, jQuery );

function wlsSyncCss(){
    jQuery('.rt-custom-css').each(function(){
        var e = ace.edit( jQuery(this).find('.custom-css').attr('id') );
        jQuery(this).find('.custom_css_textarea').val( e.getSession().getValue() );
    });
}
function rtWLSSettings(e){
    wlsSyncCss();
    jQuery('rt-response').hide();
    var arg = jQuery( e ).serialize();
    var bindElement = jQuery('.rtSaveButton');
    wlsAjaxCall( bindElement, 'rtWLSSettings', arg, function(data){
        if(data.error){
            jQuery('.rt-response').addClass('updated');
            jQuery('.rt-response').removeClass('error');
            jQuery('.rt-response').show('slow').text(data.msg);
        }else{
            jQuery('.rt-response').addClass('error');
            jQuery('.rt-response').show('slow').text(data.msg);
        }
    });

}


function wlsAjaxCall( element, action, arg, handle){
    var data;
    if(action) data = "action=" + action;
    if(arg)    data = arg + "&action=" + action;
    if(arg && !action) data = arg;

    var n = data.search(wls.nonceID);
    if(n<0){
        data = data + "&"+ wls.nonceID + "=" + wls.nonce;
    }
    jQuery.ajax({
        type: "post",
        url: wls.ajaxurl,
        data: data,
        beforeSend: function() { jQuery("<span class='rt-loading'></span>").insertAfter(element); },
        success: function( data ){
            jQuery(".rt-loading").remove();
            handle(data);
        }
    });
}
