/*globals tinymce */

// Sortable | Desktop - this is: main desktop - accepted: sections
function sortableDesk(el) {
  el.sortable({
    items: '.mfn-row',

    forcePlaceholderSize: true,
    placeholder: 'mfn-placeholder',

    opacity: 0.9,
    cursor: 'move',
    distance: 5

  });
}

// Sortable | Section - this is: section - accepted: wrap, divider
function sortableSection(el) {
  el.sortable({
    connectWith: '.mfn-sortable-row',

    items: '.mfn-wrap',

    forcePlaceholderSize: true,
    placeholder: 'mfn-placeholder',

    opacity: 0.9,
    cursor: 'move',
    cursorAt: {
      top: 20,
      left: 20
    },
    distance: 5,

    receive: sortableSectionReceive // on drop into, NOT on update position after drag
  });
}

function sortableSectionReceive(event, ui) {
  var targetSectionID = jQuery(this).siblings('.mfn-row-id').val();
  ui.item.find('.mfn-wrap-parent').val(targetSectionID);
}

// Sortable | Wrap - this is: wrap - accepted: item
function sortableWrap(el) {
  el.sortable({
    connectWith: '.mfn-sortable-wrap',

    items: '.mfn-item',
    cancel: '.mfn-popup',

    forcePlaceholderSize: true,
    placeholder: 'mfn-placeholder',

    forceHelperSize: false,
    helper: function(event, ui) {

      var title = ui.attr('data-title');
      var helper = jQuery('<div class="mfn-helper">' + title + '</div>').prependTo('body');
      return helper;

    },

    opacity: 0.9,
    cursor: 'move',
    cursorAt: {
      top: 20,
      left: 20
    },
    distance: 5,

    over: function(event, ui) {

      var size = ui.item.attr('data-size');
      var parentW = ui.placeholder.parent().width();

      // FIX | item margin 0.5%
      var margins = Math.round(1 / size);
      margins = margins * 0.01;
      parentW = parentW - parentW * margins;

      var placeholderW = parentW * size;
      placeholderW = Math.round(placeholderW) - 2;

      ui.placeholder.width(placeholderW);

    },

    receive: sortableWrapReceive // on drop into, NOT on update position after drag
  });
}

function sortableWrapReceive(event, ui) {
  var targetWrapID = jQuery(this).siblings('.mfn-wrap-id').val();
  ui.item.find('.mfn-item-parent').val(targetWrapID);
}

// window.onbeforeunload
function enableBeforeUnload() {
  window.onbeforeunload = function(e) {
    return 'The changes you made will be lost if you navigate away from this page';
  };
}

function disableBeforeUnload() {
  window.onbeforeunload = null;
}

jQuery('form').submit(function() {
  disableBeforeUnload();
});



/* ---------------------------------------------------------------------------
 * Muffin Builder 3.0
 * --------------------------------------------------------------------------- */

function mfnBuilder($) {

  var desktop = jQuery('#mfn-desk');
  if (!desktop.length) {
    return false; // Exit if Builder HTML does not exist
  }


  // Sizes ----------------------------------------
  var items = {
    'wrap': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],

    'accordion': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'article_box': ['1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'before_after': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'blockquote': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'blog': ['1/1'],
    'blog_news': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'blog_slider': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'blog_teaser': ['1/1'],
    'button': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'call_to_action': ['1/1'],
    'chart': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'clients': ['1/1'],
    'clients_slider': ['1/1'],
    'code': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'column': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'contact_box': ['1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'content': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'countdown': ['1/1'],
    'counter': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'divider': ['1/1'],
    'fancy_divider': ['1/1'],
    'fancy_heading': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'feature_box': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'feature_list': ['1/1'],
    'faq': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'flat_box': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'helper': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'hover_box': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'hover_color': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'how_it_works': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'icon_box': ['1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'image': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'image_gallery': ['1/1'],
    'info_box': ['1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'list': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'map_basic': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'map': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'offer': ['1/1'],
    'offer_thumb': ['1/1'],
    'opening_hours': ['1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'our_team': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'our_team_list': ['1/1'],
    'photo_box': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'placeholder': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'portfolio': ['1/1'],
    'portfolio_grid': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'portfolio_photo': ['1/1'],
    'portfolio_slider': ['1/1'],
    'pricing_item': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'progress_bars': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'promo_box': ['1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'quick_fact': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'shop_slider': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'sidebar_widget': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'slider': ['1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'slider_plugin': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'sliding_box': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'story_box': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'tabs': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'testimonials': ['1/1'],
    'testimonials_list': ['1/1'],
    'trailer_box': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'timeline': ['1/1'],
    'video': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'visual': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'zoom_box': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1']
  };

  var sizes = {
    '1/6': 0.1666,
    '1/5': 0.2,
    '1/4': 0.25,
    '1/3': 0.3333,
    '2/5': 0.4,
    '1/2': 0.5,
    '3/5': 0.6,
    '2/3': 0.6667,
    '3/4': 0.75,
    '4/5': 0.8,
    '5/6': 0.8333,
    '1/1': 1
  };


  // Textarea Shortcodes ------------------------------
  var shortcodes = {
    'alert': '[alert style="warning"]Insert your content here[/alert]',
    'blockquote': '[blockquote author="" link="" target="_blank"]Insert your content here[/blockquote]',
    'button': '[button title="Button" link="" target="_blank" align="" icon="" icon_position="" color="" font_color="" size="2" full_width="" class="" download="" rel="" onclick=""]',
    'code': '[code]Insert your content here[/code]',
    'content_link': '[content_link title="" icon="icon-lamp" link="" target="_blank" class="" download=""]',
    'dropcap': '[dropcap font="" size="1" background="" color="" circle="0" transparent="0"]I[/dropcap]nsert your content here',
    'fancy_link': '[fancy_link title="" link="" target="" style="1" class="" download=""]',
    'google_font': '[google_font font="Open Sans" size="25" weight="400" italic="0" letter_spacing="" color="#626262" subset=""]Insert your content here[/google_font]',
    'heading': '[heading tag="h2" align="center" color="#000" style="lines" color2="#000"]Insert your content here[/heading]',
    'highlight': '[highlight background="" color=""]Insert your content here[/highlight]',
    'hr': '[hr height="30" style="default" line="default" themecolor="1"]',
    'icon': '[icon type="icon-lamp"]',
    'icon_bar': '[icon_bar icon="icon-lamp" link="" target="_blank" size="" social=""]',
    'icon_block': '[icon_block icon="icon-lamp" align="" color="" size="25"]',
    'idea': '[idea]Insert your content here[/idea]',
    'image': '[image src="" width="" height="" align="" stretch="0" border="0" margin_top="" margin_bottom="" link_image="" link="" target="" hover="" alt="" caption="" greyscale="" animate=""]',
    'popup': '[popup title="Title" padding="0" button="0"]Insert your popup content here[/popup]',
    'progress_icons': '[progress_icons icon="icon-heart-line" image="" count="5" active="3" background=""]',
    'share_box': '[share_box]',
    'table': '<table><thead><tr><th>Column 1 heading</th><th>Column 2 heading</th><th>Column 3 heading</th></tr></thead><tbody><tr><td>Row 1 col 1 content</td><td>Row 1 col 2 content</td><td>Row 1 col 3 content</td></tr><tr><td>Row 2 col 1 content</td><td>Row 2 col 2 content</td><td>Row 2 col 3 content</td></tr></tbody></table>',
    'tooltip': '[tooltip hint="Insert your hint here"]Insert your content here[/tooltip]',
    'tooltip_image': '[tooltip_image hint="Insert your hint here" image=""]Insert your content here[/tooltip_image]',
  };


  // Sortable Init ---------------------------------
  sortableDesk(desktop);
  sortableSection(desktop.find('.mfn-sortable-row'));
  sortableWrap(desktop.find('.mfn-sortable-wrap'));


  /**
   * Attributes
   */

  var uids = [];
  var targetWrap = false;

  /**
   * Helper
   * Helper functions
   */

   /**
    * Unique ID
    * Generate unique ID and check for collisions
    */

   function uniqueID(){

     var uid = Math.random().toString(36).substr(2, 9);

     if( -1 !== uids.indexOf(uid) ){
       return uniqueID();
     }

     uids.push( uid );

     return uid;
   }

   /**
    * Get IDs
    * Get all existing IDs and set if ID is empty
    */

   function getIDs(){

     $('.mfn-row-id, .mfn-wrap-id, .mfn-item-id',desktop).each(function(){
       if( ! $(this).val() ){
         $(this).val(uniqueID());
       } else {
         uids.push( $(this).val() );
       }
     });

   }
   getIDs();

  /**
   * Sections
   */

  /**
   * Section | Add
   * Add new section, enable sortable, set attributes and section ID
   */

  jQuery('.mfn-row-add-btn').click(function() {

    var clone = jQuery('#mfn-rows .mfn-row').clone(true);

    // block window unload if any changes were made

    enableBeforeUnload();

    // enable sortable

    sortableSection(clone.find('.mfn-sortable-row'));

    // hide clone and set attributes

    clone.hide().find('.mfn-element-content input').each(function() {
      jQuery(this).attr('name', jQuery(this).attr('class') + '[]');
    });

    // data-name -> name

    clone.find('.mfn-element-meta').find('input, select, textarea').each(function() {
      jQuery(this).attr('name', jQuery(this).attr('data-name'));
    });

    // section ID

    clone.find('.mfn-row-id').val(uniqueID());

    // insert add as first or last

    if (jQuery(this).hasClass('add-first')) {
      desktop.prepend(clone).find('.mfn-row').fadeIn(300);
    } else {
      desktop.append(clone).find('.mfn-row').fadeIn(300);
    }

    // show add last section button

    if ($('.mfn-row',desktop).length) {
      $('.mfn-row-add.last').fadeIn(300, function() {
        $(this).removeClass('hide');
      });
    }

  });

  /**
   * Section | Clone
   * Clone target section, reinit sortable, set ID, wrap ID and wrap parent ID
   */

  jQuery('.mfn-row .mfn-row-clone').click(function() {

    var element = jQuery(this).closest('.mfn-row'),
      clone = false;

    // block window unload if any changes were made

    enableBeforeUnload();

    // destroy sortable, clone element

    element.find('.mfn-sortable').sortable('destroy');
    clone = element.clone(true);

    // reinitialize sortable

    sortableSection(element.find('.mfn-sortable-row'));
    sortableSection(clone.find('.mfn-sortable-row'));
    sortableWrap(element.find('.mfn-sortable-wrap'));
    sortableWrap(clone.find('.mfn-sortable-wrap'));

    // set section ID and wrap parent ID

    clone.find('.mfn-row-id, .mfn-wrap-parent').val(uniqueID());

    // set wrap ID and items parent ID

    clone.find('.mfn-wrap').each(function() {
      jQuery(this).find('.mfn-wrap-id, .mfn-item-parent').val(uniqueID());
    });

    // set items ID

    clone.find('.mfn-item').each(function() {
      jQuery(this).find('.mfn-item-id').val(uniqueID());
    });

    // insert after current section

    element.after(clone);
  });

  /**
   * Section | Visibility
   * Show / Hide section
   */

  jQuery('.mfn-element-hide').click(function() {

    var item = jQuery(this).closest('.mfn-element');

    if (item.hasClass('hide')) {

      // Show

      jQuery(this).removeClass('dashicons-hidden').addClass('dashicons-visibility');
      item.removeClass('hide').css('opacity', 1);

      item.find('tr.hidden input[name="mfn-rows[hide][]"]').val(0);

    } else {

      // Hide

      jQuery(this).removeClass('dashicons-visibility').addClass('dashicons-hidden');
      item.addClass('hide');

      item.find('tr.hidden input[name="mfn-rows[hide][]"]').val(1);

    }

  });

  /**
   * Wraps
   */

   /**
    * Wrap | Add
    * Add new wrap, enable sortable, set attributes and wrap ID
    */

  jQuery('.mfn-add-wrap').click(function() {

    var parentDesktop = jQuery(this).closest('.mfn-row').find('.mfn-sortable-row').first();
    var targetParentID = jQuery(this).closest('.mfn-row').find('.mfn-row-id').val();

    var clone = jQuery('#mfn-wraps .mfn-wrap').clone(true);

    // block window unload if any changes were made

    enableBeforeUnload();

    // enable sortable

    sortableWrap(clone.find('.mfn-sortable-wrap'));

    // hide clone and set attributes

    clone.hide().find('.mfn-element-content > input').each(function() {
      jQuery(this).attr('name', jQuery(this).attr('class') + '[]');
    });

    // data-name -> name

    clone.find('.mfn-element-meta').find('input, select, textarea').each(function() {
      jQuery(this).attr('name', jQuery(this).attr('data-name'));
    });

    // set wrap ID and parent section ID

    clone.find('.mfn-wrap-id').val(uniqueID());
    clone.find('.mfn-wrap-parent').val(targetParentID);

    // insert at the end of target section

    parentDesktop.append(clone).find('.mfn-wrap').fadeIn(300);

  });

  /**
   * Wrap | Clone
   * Clone target wrap, reinit sortable, set ID, items ID and parent ID
   */

  jQuery('.mfn-wrap .mfn-wrap-clone').click(function() {

    var element = jQuery(this).closest('.mfn-wrap');

    // block window unload if any changes were made

    enableBeforeUnload();

    // destroy sortable, clone element

    element.find('.mfn-sortable').sortable('destroy');
    var clone = element.clone(true);

    // reinitialize sortable

    sortableWrap(element.find('.mfn-sortable-wrap'));
    sortableWrap(clone.find('.mfn-sortable-wrap'));

    // set wrap ID and items parent ID

    clone.find('.mfn-wrap-id, .mfn-item-parent').val(uniqueID());

    // set item ID

    clone.find('.mfn-item').each(function() {
      jQuery(this).find('.mfn-item-id').val(uniqueID());
    });

    // insert after current wrap

    element.after(clone);
  });

  /**
   * Wrap | Divider
   * Add new divider, set attributes and wrap ID
   */

  jQuery('.mfn-add-divider').click(function() {

    var parentDesktop = jQuery(this).closest('.mfn-row').find('.mfn-sortable-row').first();
    var targetParentID = jQuery(this).closest('.mfn-row').find('.mfn-row-id').val();

    var clone = jQuery('#mfn-wraps .mfn-wrap').clone(true);

    // block window unload if any changes were made

    enableBeforeUnload();

    // hide clone and set attributes

    clone.hide().find('.mfn-element-content > input').each(function() {
      jQuery(this).attr('name', jQuery(this).attr('class') + '[]');
    });

    // data-name -> name

    clone.find('.mfn-element-meta').find('input, select, textarea').each(function() {
      jQuery(this).attr('name', jQuery(this).attr('data-name'));
    });

    // set cloned wrap as divider

    clone.addClass('divider')
      .find('.mfn-wrap-size').val('divider');

    // set wrap ID and parent section ID

    clone.find('.mfn-wrap-id').val(uniqueID());
    clone.find('.mfn-wrap-parent').val(targetParentID);

    // insert at the end of target section

    parentDesktop.append(clone).find('.mfn-wrap').fadeIn(300);
  });

  /**
   * Add item
   */

  /**
   * Add item | Open
   * Show add item popup
   */

  jQuery('.mfn-add-item').click(function() {

    // disable background content scrolling & dragging

    jQuery('body').addClass('mfn-popup-open');
    jQuery('#mfn-content').find('.ui-sortable').sortable('disable');

    // show popup and set target wrap

    jQuery('#mfn-item-add').fadeIn(300);
    targetWrap = jQuery(this).closest('.mfn-wrap');

    // activate first tab

    jQuery('#mfn-item-add').find('.mfn-popup-tabs li:first').click();
  });

  /**
   * Add item | Close
   * Close add item popup
   */

  jQuery('#mfn-item-add .mfn-ph-close').click(function() {

    // enable background content scrolling & dragging

    jQuery('body').removeClass('mfn-popup-open');
    jQuery('#mfn-content').find('.ui-sortable').sortable('enable');

    // hide popup and reset target wrap

    jQuery('#mfn-item-add').fadeOut(300);
    targetWrap = false;

  });

  /**
   * Add item | Tabs
   * Filter items by categories
   */

  jQuery('#mfn-item-add .mfn-popup-tabs li').click(function() {

    var filter = jQuery(this).attr('data-filter');
    var items = jQuery(this).closest('.mfn-popup-content').find('.mfn-popup-items');

    // clear search field

    jQuery('#mfn-item-add .mfn-search-item').val('');

    // add active on tab click and filter

    jQuery(this).addClass('active')
      .siblings().removeClass('active');

    if (filter == '*') {
      items.find('li').show();
    } else {
      items.find('li.category-' + filter).show();
      items.find('li').not('.category-' + filter).hide();
    }

  });

  /**
   * Add item | Search
   * Filter items by search filed value
   */

  jQuery('#mfn-item-add .mfn-search-item').on('keyup', function() {

    var filter = jQuery(this).val().toLowerCase();
    var items = jQuery(this).closest('.mfn-popup-content').find('.mfn-popup-items');

    if (filter.length) {

      items.find('li[data-type*=' + filter + ']').show();
      items.find('li').not('[data-type*=' + filter + ']').hide();

      // remove active from category tabs

      jQuery('#mfn-item-add .mfn-popup-tabs li').removeClass('active');

    } else {

      items.find('li').show();

      // activate first tab

      jQuery('#mfn-item-add .mfn-popup-tabs li:first').addClass('active');

    }

  });

  /**
   * Items
   */

  /**
   * Item | Add
   * Add new item, set attributes and item ID
   */

  jQuery('#mfn-item-add .mfn-popup-items li a').click(function() {

    var parentDesktop = targetWrap.find('.mfn-sortable-wrap').first();
    var targetParentID = targetWrap.find('.mfn-wrap-id').val();
    var wrapSize = targetWrap.closest('.mfn-wrap').attr('data-size');

    var item = jQuery(this).attr('data-type');
    var clone = jQuery('#mfn-items').find('div.mfn-item-' + item).clone(true);

    // block window unload if any changes were made

    enableBeforeUnload();

    // hide add item popup

    jQuery('#mfn-item-add').fadeOut(300);

    // enable background content scrolling & dragging

    jQuery('body').removeClass('mfn-popup-open');
    jQuery('#mfn-content').find('.ui-sortable').sortable('enable');

    // hide clone and set attributes

    clone.hide().find('.mfn-element-content input').each(function() {
      jQuery(this).attr('name', jQuery(this).attr('class') + '[]');
    }); // change it to use data-name

    // data-name -> name

    clone.find('.mfn-element-meta').find('input, select, textarea').each(function() {
      jQuery(this).attr('name', jQuery(this).attr('data-name'));
    });

    // set item ID and parent wrap ID

    clone.find('input.mfn-item-id').val(uniqueID());
    clone.find('.mfn-item-parent').val(targetParentID);

    // small wrap fix | if wrap is smaller than 1/2 add 1/1 item

    if (wrapSize < 0.5) {
      clone.attr('data-size', 1);
      clone.find('input.mfn-item-size').val('1/1');
      clone.find('.mfn-item-size span').text('1/1');
    }

    // insert at the end of target wrap

    parentDesktop.append(clone).find(".mfn-item").fadeIn(300);
  });

  /**
   * Item | Clone
   * Clone target item, set new item ID
   */

  jQuery('.mfn-item .mfn-item-clone').click(function() {

    var element = jQuery(this).closest('.mfn-element');
    var clone = element.clone(true);

    // block window unload if any changes were made

    enableBeforeUnload();

    // set new ID

    clone.find('.mfn-item-id').val(uniqueID());

    // insert after current item

    element.after(clone);
  });

  /**
   * Elements
   * Below functions are the same for items, elements and sections
   */

  /**
   * Element | Resize ++
   * Increase width of target element
   */

  jQuery('.mfn-item-size-inc').click(function() {

    var el = jQuery(this).closest('.mfn-element'),
      type = 'wrap',
      el_sizes = false;

    // block window unload if any changes were made

    enableBeforeUnload();

    // is it and item or a wrap

    if ( ! el.hasClass('mfn-wrap')) {
      type = el.find('.mfn-item-type').first().val();
    }

    // check available sizes for current item

    el_sizes = items[type];

    for (var i = 0; i < el_sizes.length - 1; i++) {
      if (el.attr('data-size') == sizes[el_sizes[i]]) {

        el.attr('data-size', sizes[el_sizes[i + 1]])
          .find('.mfn-item-size, .mfn-wrap-size').first().val(el_sizes[i + 1]);

        el.find('.mfn-item-desc').first().text(el_sizes[i + 1]);

        break;
      }
    }
  });

  /**
   * Element | Resize --
   * Decrease width of target element
   */

  jQuery('.mfn-item-size-dec').click(function() {

    var el = jQuery(this).closest('.mfn-element'),
      type = 'wrap',
      el_sizes = false;

    // block window unload if any changes were made

    enableBeforeUnload();

    // is it and item or a wrap

    if ( ! el.hasClass('mfn-wrap')) {
      type = el.find('.mfn-item-type').first().val();
    }

    // check available sizes for current item

    el_sizes = items[type];

    for (var i = 1; i < el_sizes.length; i++) {
      if (el.attr('data-size') == sizes[el_sizes[i]]) {

        el.attr('data-size', sizes[el_sizes[i - 1]])
          .find('.mfn-item-size, .mfn-wrap-size').first().val(el_sizes[i - 1]);

        el.find('.mfn-item-desc').first().text(el_sizes[i - 1]);

        break;
      }
    }
  });

  /**
   * Element | Delete
   * Remove target element
   */

  jQuery('.mfn-element-delete').click(function() {

    var item = jQuery(this).closest('.mfn-element');

    // block window unload if any changes were made

    enableBeforeUnload();

    // confirm & delete

    if (confirm("You are about to delete this element.\nIt can not be restored at a later time! Continue?")) {
      item.fadeOut(300, function() {
        jQuery(this).remove();
      });
    } else {
      return false;
    }

    // hide add last section button

    if (jQuery('.mfn-row',desktop).length == 1) {
      jQuery('.mfn-row-add.last').fadeOut(300);
    }

  });

  /**
   * Element | Edit
   * Open edit popup for: section, wrap or item
   */

  jQuery('.mfn-element-edit').click(function() {

    var el = jQuery(this).closest('.mfn-element');
    var title = el.attr('data-title');
    var type = el.children().children('.mfn-item-type').val();

    var meta = el.children('.mfn-element-meta');
    var popup = null;

    // block window unload if any changes were made

    enableBeforeUnload();

    // disable background content scrolling & dragging

    jQuery('body').addClass('mfn-popup-open');
    jQuery('#mfn-content').find('.ui-sortable').sortable('disable');
    jQuery(this).closest('.mfn-row').addClass('editing');

    // build popup html

    meta
      .wrap('<div class="mfn-popup mfn-popup-item-edit"><div class="mfn-popup-inside"><div class="mfn-popup-content"></div></div></div>')
      .show();

    popup = meta.closest('.mfn-popup');

    popup.find('.mfn-popup-inside').prepend('<div class="mfn-popup-header"><div class="mfn-ph-left"><span class="mfn-ph-btn mfn-ph-desc">' + title + '</span></div><div class="mfn-ph-right"><a class="mfn-ph-btn mfn-ph-close dashicons dashicons-no" href="#"></a></div></div>');
    popup.find('.mfn-popup-content').append('<a class="mfn-popup-close mfn-ph-close" href="#">Save changes</a>');

    // trigger custom event mfn:builder:edit
    // field_visual.js

    jQuery(document).trigger('mfn:builder:edit', [popup, type]);

    // colorpicker
    // TODO: move it to field color file and bind to mfn:builder:edit

    jQuery('.mfn-field-color', popup).each(function() {
      var cp = jQuery(this);
      var cp_input = jQuery('input.has-colorpicker', cp).clone();

      cp_input
        .show()
        .removeClass('wp-color-picker')
        .prependTo(cp);

      jQuery('.wp-picker-container', cp).remove();

      jQuery('input.has-colorpicker', cp).wpColorPicker({
        mode: 'hsl',
        width: 275,
      });

    });

    // show popup

    popup.fadeIn(300);

  });

  /**
   * Element | Close
   * Close edit popup for: section, wrap or item
   */

  jQuery('body').on('click', '.mfn-popup-item-edit .mfn-ph-close', function(e) {

    var popup = jQuery(this).closest('.mfn-popup');
    var type = popup.closest('.mfn-element').children().children('.mfn-item-type').val();
    var meta = null;

    // default link action should not be taken

    e.preventDefault();

    // trigger custom event mfn:builder:close
    // field_visual.js

    jQuery(document).trigger('mfn:builder:close', [popup, type]);

    // UI sortable | destroy

    jQuery('.gallery-container.ui-sortable').sortable('destroy');
    jQuery('.tabs-ul.ui-sortable').sortable('destroy');

    // enable background content scrolling & dragging

    jQuery('body').removeClass('mfn-popup-open');
    jQuery('#mfn-content').find('.ui-sortable').sortable('enable');
    jQuery(this).closest('.mfn-row').removeClass('editing');

    // hide popup

    popup.fadeOut(300);

    // item edit: update item title and excerpt

    if (jQuery(popup.hasClass('mfn-popup-item-edit'))) {

      // update title

      var label = popup.find('input.mfn-item-title').first().val();
      popup.closest('.mfn-element').find('.mfn-item-label').first().html(label);

      // update excerpt

      var excerpt = popup.find('textarea.mfn-item-excerpt').first().val();
      if (excerpt) {

        // strip_tags

        var tmp = document.createElement('DIV');
        tmp.innerHTML = excerpt;
        excerpt = tmp.textContent || tmp.innerText || "";

        // strip_shortcodes

        excerpt = excerpt.replace(/\[.*?\]/g, ''); // do not put space before regex

        // 16 words

        excerpt = excerpt.split(" ").splice(0, 16).join(" ");

        popup.closest('.mfn-element').find('.mfn-item-excerpt').first().html(excerpt);
      }

      // remove popup html

      setTimeout(function() {

        meta = popup.find('.mfn-element-meta');

        popup.find('.mfn-popup-header').remove();
        popup.find('.mfn-popup-close').remove();

        meta.unwrap().unwrap().unwrap();

        meta.hide();

      }, 300);

    }

  });



  // Popup | Click Outside Popup ----------------------------------

  jQuery('body').on('click', '.mfn-popup', function(e) {
    var target = jQuery(e.target);

    if (target.hasClass('mfn-popup')) {
      jQuery(this).find('.mfn-ph-close').click();
    }
  });


  jQuery('body').keydown(function(event) {
    var el = jQuery('#mfn-content .mfn-popup');

    if (el.length) {

      // ESC
      if (event.keyCode == 27) {
        el.find('.mfn-ph-close').click();
      }

    }

  });


  // Popup | Visual Editor - Switch Editor  -----------------------

  jQuery('body').on('click', '.mfn-switch-editor', function(e) {
    e.preventDefault();

    if (tinymce.get('mfn-editor')) {
      tinymce.execCommand('mceRemoveEditor', false, 'mfn-editor');
    } else {
      tinymce.execCommand('mceAddEditor', false, 'mfn-editor');
    }

  });



  // Extras =======================================================


  // Go to top ----------------------------------------------------

  jQuery('#mfn-go-to-top').click(function() {
    jQuery('html, body').animate({
      scrollTop: 0
    }, 500);
  });


  // Post Formats -------------------------------------------------

  jQuery('#post-formats-select label.post-format-standard').text('Standard, Horizontal Image');
  jQuery('#post-formats-select label.post-format-image').text('Vertical Image');


  // Migrate ------------------------------------------------------

  // show/hide
  jQuery('#mfn-migrate .btn-exp').click(function() {
    alert('Please remember to Publish/Update your post before Export.');
    jQuery('.migrate-wrapper ').hide();
    jQuery('.export-wrapper').show();

  });

  jQuery('#mfn-migrate .btn-imp').click(function() {
    jQuery('.migrate-wrapper ').hide();
    jQuery('.import-wrapper').show();
  });

  jQuery('#mfn-migrate .btn-tem').click(function() {
    jQuery('.migrate-wrapper ').hide();
    jQuery('.templates-wrapper').show();
  });

  // copy to clipboard
  jQuery('#mfn-items-export').click(function() {
    jQuery(this).select();
  });

  // import

  jQuery('#mfn-migrate .btn-import').click(function() {

    var el = jQuery(this).siblings('#mfn-items-import');
    el.attr('name', el.attr('id'));

    if (jQuery('#save-post').length || jQuery('.editor-post-save-draft').length) {
      // save draft
      // WP 4.9 #save-post, WP 5.0 .editor-post-save-draft
      jQuery('#save-post, .editor-post-save-draft').click();
    } else {
      // publish
      // WP 4.9 #publish, WP 5.0 .editor-post-publish-button
      jQuery('#publish, .editor-post-publish-button').click();
    }

  });

  // template

  jQuery('#mfn-migrate .btn-template').click(function() {

    var el = jQuery(this).siblings('#mfn-items-import-template');
    el.attr('name', el.attr('id'));

    if (jQuery('#save-post').length || jQuery('.editor-post-save-draft').length) {
      // save draft
      // WP 4.9 #save-post, WP 5.0 .editor-post-save-draft
      jQuery('#save-post, .editor-post-save-draft').click();
    } else {
      // publish
      // WP 4.9 #publish, WP 5.0 .editor-post-publish-button
      jQuery('#publish, .editor-post-publish-button').click();
    }

  });


  // SEO ----------------------------------------------------------

  jQuery('#wp-content-wrap .wp-editor-tabs').prepend('<a class="wp-switch-editor switch-seo" id="content-seo">Builder &raquo; SEO</a>');

  jQuery('#content-seo').click(function() {

    if (confirm("This option is useful for plugins like Yoast SEO to analize post content when you use Muffin Builder.\nIt will collect content from Muffin Builder Elements and copy it into the WordPress Editor.\n\nCurrent Editor Content will be replaced.\nYou can hide the content if you turn \"Hide the content\" option ON.\n\nPlease remember to Publish/Update your post before & after use of this option.\nContinue?")) {

      var items_decoded = jQuery('#mfn-items-seo-data').val();
      jQuery('#content-html').click();
      jQuery('#content').val(items_decoded).text(items_decoded);

    } else {
      return false;
    }

  });



  // Textarea | Shortcodes ========================================


  // Helper | Wrap Selected Text OR Insert Into Carret ------------
  function wrapText(textArea, openTag, closeTag) {
    var len = textArea.val().length;
    var start = textArea[0].selectionStart;
    var end = textArea[0].selectionEnd;
    var selectedText = textArea.val().substring(start, end);
    var replacement = openTag + selectedText + closeTag;
    textArea.val(textArea.val().substring(0, start) + replacement + textArea.val().substring(end, len));
  }


  // Add Shortcode | Menu -----------------------------------------
  jQuery('.mfn-sc-add-btn').click(function() {
    var parent = jQuery(this).parent();

    if (parent.hasClass('focus')) {
      parent.removeClass('focus');
    } else {
      jQuery('.mfn-sc-add').removeClass('focus');
      parent.addClass('focus');
    }
  });


  // Insert Shortcode ------------------------------------------------
  jQuery('.mfn-sc-add-list a').click(function() {
    jQuery(this).closest('.mfn-sc-add').removeClass('focus');

    var sc = jQuery(this).attr('data-rel');
    if (sc) {
      var shortcode = shortcodes[sc];
      var textarea = jQuery(this).closest('td').find('textarea');
      wrapText(textarea, shortcode, '');
    }
  });


  // Lipsum | Lorem Ipsum generator -------------------------------

  function lipsum() {
    var lorems = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla mauris dolor, gravida a varius blandit, auctor eget purus. Phasellus scelerisque sapien sit amet mauris laoreet, eget scelerisque nunc cursus. Duis ultricies malesuada leo vel aliquet. Curabitur rutrum porta dui eget mollis. Nullam lacinia dictum auctor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. ',
      'Duis dignissim mi ut laoreet mollis. Nunc id tellus finibus, eleifend mi vel, maximus justo. Maecenas mi tortor, pellentesque a aliquam ut, fringilla eleifend lectus. Maecenas ultrices tellus sit amet sem placerat tempor. Maecenas eget arcu venenatis, sagittis felis sit amet, dictum nisl. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus vitae vulputate elit. Fusce interdum justo quis libero ultricies laoreet. ',
      'Curabitur sed iaculis dolor, non congue ligula. Maecenas imperdiet ante eget hendrerit posuere. Nunc urna libero, congue porta nibh a, semper feugiat sem. Sed auctor dui eleifend, scelerisque eros ut, pellentesque nibh. Nam lacinia suscipit accumsan. Donec sodales, neque vitae rutrum convallis, nulla tortor pharetra odio, in varius ante ante sed nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. ',
      'Mauris rhoncus orci in imperdiet placerat. Vestibulum euismod nisl suscipit ligula volutpat, a feugiat urna maximus. Cras massa nibh, tincidunt ut eros a, vulputate consequat odio. Vestibulum vehicula tempor nulla, sed hendrerit urna interdum in. Donec et nibh maximus, congue est eu, mattis nunc. Praesent ut quam quis quam venenatis fringilla. Morbi vestibulum id tellus commodo mattis. Aliquam erat volutpat. Aenean accumsan id mi nec semper. ',
      'Sed ultrices nisl velit, eu ornare est ullamcorper a. Nunc quis nibh magna. Proin risus erat, fringilla vel purus sit amet, mattis porta enim. Duis fermentum faucibus est, sed vehicula velit sodales vitae. Mauris mollis lobortis turpis, eget accumsan ante aliquam quis. Nam ullamcorper rhoncus sem vitae tempus. Curabitur ut tortor a orci fermentum ultricies. Mauris maximus velit commodo, varius ligula vel, consequat est. ',
      'Ut ultricies imperdiet sodales. Aliquam fringilla aliquam ex sit amet elementum. Proin bibendum sollicitudin feugiat. Curabitur ut egestas justo, vitae molestie ante. Integer magna purus, commodo in diam nec, pretium auctor sapien. In pulvinar, ipsum eu dignissim facilisis, massa justo varius purus, non dictum elit nibh ut massa. Nam massa erat, aliquet a rutrum eu, sagittis ac nibh. Pellentesque velit dolor, suscipit in ligula a, suscipit rhoncus dui. ',
      'Aliquam ac dui vel dui vulputate consectetur. Mauris accumsan, massa non consectetur condimentum, diam arcu tristique nibh, nec egestas diam elit at nulla. Suspendisse potenti. In non lacinia risus, ac tempor ipsum. Phasellus venenatis leo eu semper varius. Maecenas sit amet molestie leo. Morbi vitae urna mauris. Nulla nec tortor vitae eros iaculis hendrerit aliquet non urna. Nulla sit amet vestibulum magna, eget pulvinar libero. ',
      'Fusce ut velit laoreet, tempus arcu eu, molestie tortor. Nam vel justo cursus, faucibus lorem eget, egestas eros. Maecenas eleifend erat at justo fringilla imperdiet id ac magna. Suspendisse vel facilisis odio, at ornare nibh. In malesuada, tortor eget sodales mollis, mauris lectus hendrerit purus, porttitor finibus eros lorem eget mauris. Curabitur lacinia enim at ex blandit, vel pellentesque odio elementum. ',
      'Vivamus in diam turpis. In condimentum maximus tristique. Maecenas non laoreet odio. Fusce lobortis porttitor purus, vel vestibulum libero pharetra vel. Pellentesque lorem augue, fermentum nec nibh et, fringilla sollicitudin orci. Integer pharetra magna non ante blandit lobortis. Sed mollis consequat eleifend. Aliquam consectetur orci eget dictum tristique. Aenean et sodales est, ut vestibulum lorem. ',
    ];

    var index = Math.floor(Math.random() * lorems.length);

    return lorems[index];
  }


  // Insert HTML Tag ------------------------------------------------
  jQuery('.mfn-sc-tools a').click(function() {

    var open = jQuery(this).attr('data-open').replace(/X/g, '"');
    var close = jQuery(this).attr('data-close');

    var textarea = jQuery(this).closest('td').find('textarea');

    // lipsum
    if (open == 'lipsum') {
      wrapText(textarea, lipsum(), '');
      return false;
    }

    if (close) {
      open = '<' + open + '>';
      close = '</' + close + '>';
    } else {
      open = '<' + open + ' />';
      close = '';
    }

    wrapText(textarea, open, close);

  });

}


/* ---------------------------------------------------------------------------
 * Clone fix (textarea, select)
 * --------------------------------------------------------------------------- */

(function(original) {
  jQuery.fn.clone = function() {
    var result = original.apply(this, arguments),
      my_textareas = this.find('textarea:not(.editor), select'),
      result_textareas = result.find('textarea:not(.editor), select');

    for (var i = 0, l = my_textareas.length; i < l; ++i) {
      jQuery(result_textareas[i]).val(jQuery(my_textareas[i]).val());
    }

    return result;
  };
})(jQuery.fn.clone);



/* ---------------------------------------------------------------------------
 * jQuery(document).ready
 * --------------------------------------------------------------------------- */

jQuery(document).ready(function() {
  mfnBuilder(jQuery);
});



/* ---------------------------------------------------------------------------
 * jQuery(document).mouseup
 * --------------------------------------------------------------------------- */

jQuery(document).mouseup(function(e) {
  if (jQuery(".mfn-sc-add").has(e.target).length === 0) {
    jQuery(".mfn-sc-add").removeClass('focus');
  }
});
