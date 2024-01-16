var MAX_FILESIZE = 104857600;
var AVAILABLE_EXTENTIONS =
        [
            "doc", "docx", "otd", "rtf", "html", "pdf", "jpg", "png", "ppt",
            "pptx", "tif", "xls", "xlsx", "zip", 'rar', 'jpeg', 'xml', 'psd', 'gif', "csv", "sav", "sps", "spv", "spo", "mdb", "accdb", "HEIC", "mp3", "mp4", "wav", "py", "js"
        ];

var loader = $('[data-loader]').html();
var is_loading = false;
var clear_all_button_click = false;
var default_balance_list_serialize = false;
var default_payment_list_serialize = false;
var check_count_available_orders_in_sidebar = false;
var internet_speed = {
    check_time: {
        start: false,
        end: false
    },
    downloadSize: 5616998,
    value: false
};
var tabValid = true;
var clickedTab = null;
var clickedPage = null;

var in_development = (parseInt(getCookie('test_office')) === 1);

window.addEventListener('DOMContentLoaded', function () {
    showMyOrders();
    customRadio();
    customSelect();
    toggleSidebar();
    hideSidebar();
    Tabs();
    topbarCounter();
    toTop();
    hideMenu();
    hideBodyContent()
    $(window).on('resize', function () {
        hideSidebar();
    });
});

var Base64 = {
    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },
    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },
    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },
    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}

//hide accordion item
function hideBodyContent() {
    $(".card-body").on('click', function (e) {
        if (e.target.tagName.toLowerCase() === 'a') {
            e.stopPropagation();
        } else {
            $(this).parents(".card").find(".card-header a").trigger('click');
        }
    });
}

//hide profile menu
function hideMenu() {
    $("[aria-labelledby='profile-menu'] a.dropdown-item").click(function () {
        $("[aria-labelledby='profile-menu']").removeClass("show");
    });
}

// Button Back in browser
window.addEventListener('popstate', function (event)
{
    document.location.href = location.href;
});


function getInternetSpeed() {
    var userImageLink = "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20200714180638/CIP_Launch-banner.png";

    // The size in bytes 
    var downloadImgSrc = new Image();

    downloadImgSrc.onload = function () {
        internet_speed.check_time.end = new Date().getTime();
        setInternetSpeed();
    };

    internet_speed.check_time.start = new Date().getTime();
    downloadImgSrc.src = userImageLink;
}

function setInternetSpeed() {
    var timeDuration = (internet_speed.check_time.end - internet_speed.check_time.start) / 1000;
    var loadedBytes = internet_speed.downloadSize;

    /* Converts a number into string 
     using toFixed(2) rounding to 2 */
    var Bps = (loadedBytes / timeDuration).toFixed(2);
    var KBps = (Bps / 1024).toFixed(2);
    var MBps = (KBps / 1024).toFixed(2);

    internet_speed.value = {
        bytes: Bps,
        Kbytes: KBps,
        Mbytes: MBps
    };
}

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, time, path) {
    var path = path || '/';
    var expires = "";
    if (time) {
        var date = new Date();
        date.setTime(date.getTime() + (time * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=" + path;
}

function removeCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


// Toggle the side navigation
function toggleSidebar() {
    $("#sidebarToggle").on('click', function (e) {
        $(".sidebar").toggleClass("toggled");
        $('.sidebar-brand-desk').toggleClass("toggled");
        $('.sidebar-brand-mob').toggleClass("toggled");
        $('.topbar-btn-balance').toggleClass("toggled");
    });
    $("#sidebarToggleTop").on('click', function (e) {
        $("body").toggleClass("sidebar-toggled");
    });
    $("#sidebarToggleMob").on('click', function (e) {
        $("body").toggleClass("sidebar-toggled");
    });
}

//Hide Sidebar tablet/mobile
function hideSidebar() {
    var windowWidth = $(window).width();
    if (windowWidth > 767 && windowWidth < 992) {
        $(".sidebar").addClass("toggled");
        $('.sidebar-brand-desk').addClass("toggled");
        $('.sidebar-brand-mob').removeClass("toggled");
        $('.topbar-btn-balance').removeClass("toggled");
    } else {
        $(".sidebar").removeClass("toggled");
        $('.sidebar-brand-desk').removeClass("toggled");
        $('.sidebar-brand-mob').addClass("toggled");
        $('.topbar-btn-balance').addClass("toggled");
    }
}

//FIX SIDEBAR OUTSIDE CLICK 3139
jQuery(function ($) {
    $(document).on("click", "#accordionSidebar", function (e) {
        var sidebarWrap = $(".sidebar-wrap");
        if (!sidebarWrap.is(e.target)
                && sidebarWrap.has(e.target).length === 0) {
            $("body").removeClass("sidebar-toggled");
        }
    });
});
//end FIX SIDEBAR OUTSIDE CLICK 3139

function toggleUp() {
    $(".contact-button-in").toggleClass("up");
    $(".menu-button").toggleClass("contact-button-out");
}

function customRadio() {
    $('.checkbox-v input[type="checkbox"]').on('click touchstart', function () {
        $('.checkbox-v input[type="checkbox"]').each(function () {
            $(this).parents(".checkbox-v").removeClass("check-active");
            if ($(this).is(":checked")) {
                $(this).parents(".checkbox-v").addClass("check-active");
            }
        });
    });
}

function customSelect() {
    $(".custom-select").select2({
        minimumResultsForSearch: -1,
        containerCssClass: 'custom-select-wrapper',
        dropdownCssClass: 'custom-select-wrapper'
    });
}

function datePicker() {
    if ($('.datetimepicker')) {
        $('.datetimepicker').datetimepicker({
            defaultDate: new Date()
        });
    }
}

function CustomScroll() {
    var windowWidth = $(window).width();
    var element = $('.scroll-pane').jScrollPane();
    var api = element.data('jsp');
    if (windowWidth > 767 && windowWidth < 1440) {
        $('#exstras-wrapper').addClass('scroll-pane');
        $(function () {
            $('.scroll-pane').jScrollPane();
        });
    } else {
        try {
            api.destroy();
        } catch (err) {

        }
        $('#exstras-wrapper').removeClass('scroll-pane');
    }
}

function leaveTab() {
    tabValid = true;
    $("#tab-2").find('.qualification-box').each(function () {
        if ($(this).css('display') == 'block') {
            tabValid = false;
        }
    })

    if ($("#tab-3").find('.payment-box-active').length) {
        tabValid = false;
    }

    if (!tabValid) {
        $("#ModalDiscardChanges").modal('show');
    }
}

function Tabs() {
    $(document).on("click", "ul.tabs li", function () {

        if ($(this).data('tabStatus') && is_loading) {
            return false;
        }
        var tab_id = $(this).attr('data-tab');
        let tab_name = $(this).data('tab-name');
        
        if((tab_id == 'tab-3' || tab_id == 'tab-4')  && CURRENT_USER.status != 40) {
            return false;
        }
        
        leaveTab();
        if (tab_id) {
            clickedTab = tab_id.split('tab-')[1];
        }
        
        if (tabValid) {
            clickedTab = null;
            $('ul.tabs li').removeClass('current');
            $('.tab-content').removeClass('current');
            $(this).addClass('current');
            $("#" + tab_id).addClass('current');
            scroll_loading_tab = tab_id;
            customSelect();
            if ($(this).data('tabStatus')) {
                myOrdersFilterVisibility();
                myOrdersList($(this).data('tabStatus'));

            }
            if(window.location.pathname.split('?')[0] == '/settings') {
                window.history.replaceState(null, null, '?tab='+tab_name);
            }
        }
    });
}

function topbarCounter() {
    var count = document.querySelector(".topbar .counter");
    if (count) {
        var counter = count.innerHTML;
        if (counter > 999) {
            count.innerHTML = counter.substring(0, 1) + "k";
        } else {
            return false;
        }
    }

}

function checkForChanges() {
    var height = $('.topbar').height();
    $('.orders-caption').css('top', height);
    setTimeout(checkForChanges, 500);
}
checkForChanges();


// show/open sidebar order list by cookie
function showMyOrders() {
    if ($.cookie('show-orders')) {
        $(".collapsed-orders").removeClass("collapsed");
        $(".nav__orders-list").addClass("show");
        $('[data-summary_counter]').css('opacity', 0);
        $('[data-fire-icon-sidebar]').css('opacity', 0);
    }
    if ($.cookie('hide-orders')) {
        $(".collapsed-orders").addClass("collapsed");
        $(".nav__orders-list").removeClass("show");
        $('[data-summary_counter]').css('opacity', 1);
        $('[data-fire-icon-sidebar]').css('opacity', 1);
    }
    $(".collapsed-orders").on("click", function () {
        $.cookie('show-orders', '', {expires: -1});
        $.cookie('hide-orders', '', {expires: -1});
        if ($(this).hasClass("collapsed")) {
            $.cookie('show-orders', '1');
            $('[data-summary_counter]').css('opacity', 0);
            $('[data-fire-icon-sidebar]').css('opacity', 0);
        } else {
            $.cookie('hide-orders', '1');
            $('[data-summary_counter]').css('opacity', 1);
            $('[data-fire-icon-sidebar]').css('opacity', 1);
        }
    });
}

// END show/open sidebar order list by cookie

// btn go top
function toTop() {
    $('#content-wrapper').scroll(function () {
        if ($('#content-wrapper').scrollTop() > 500) {
            $('.scrolltop').addClass('show');
        } else {
            $('.scrolltop').removeClass('show');
        }
    });

    $('.scrolltop').click(function () {
        $('#content-wrapper').animate({scrollTop: 0}, 800);
        return false;
    });
}
//END btn go top   

//order table hat
function sameWidth() {
    $(".th-id").css({'width': ($(".short-view .order-item-header").width() + 'px')});
}

$(document).on("click", ".nav-tabs > li > a", function () {
    $('.nav-tabs > li').each(function () {
        $(this).removeClass("active");
    });
    $(this).tab('show');
    $(this).parent('li').addClass("active");
});

$(document).ready(function () {

    //simple accordion
    $(".item-block").on("click", function () {
        $(".item-block").each(function () {
            $(this).removeClass("open");
        });
        $(this).addClass("open");
    });

    //hide menu on mobile
    $(".nav-link").on("click", function () {
        $("#sidebarToggleMob").trigger('click');
    });

    getInternetSpeed();

    //sticky table header
    if ($('.order-list-th').length) {
        var fixmeTop = $('.order-list-th').offset().top;
        $('#content-wrapper').scroll(function () {
            var currentScroll = $('#content-wrapper').scrollTop(),
                    topbarHeight = $('.navbar').height();

            if (currentScroll >= (fixmeTop - topbarHeight)) {  // apply position: fixed if you
                $('.order-list-th').addClass("fixed-header");
                $('.order-list-th').css({ // scroll to that element or below it
                    top: topbarHeight
                });
            } else {   
                $('.order-list-th').removeClass("fixed-header");
            }

        });
    }

    var searching_now = false;
    $('[data-form-search-toolbar]').submit(function (e) {
        if (searching_now)
            return false;
        searching_now = true;
        e.preventDefault();
        var value_id = $.trim($(this).find('input[name="order_id"]').val());
        if (value_id.length < 1) {
            return false;
        }
        $('[data-form-search-toolbar]').find('[data-search-icon]').hide();
        $('[data-form-search-toolbar]').find('[data-searching-icon]').show();
        var url = $(this).attr('action');
        callAjax(
                'html',
                url,
                function (data) {
                    searching_now = false;
                    var isValidJSON = data ? true : false;
                    try {
                        JSON.parse(data)
                    } catch (e) {
                        isValidJSON = false
                    }
                    $('[data-form-search-toolbar]').find('[data-searching-icon]').hide();
                    $('[data-form-search-toolbar]').find('[data-search-icon]').show();
                    if (isValidJSON) {
                        var result = JSON.parse(data);
                        if (result.redirect) {
                            if (result.redirect.indexOf('my_orders') > -1 || result.redirect.indexOf('available_orders') > -1) {
                                window.open(result.redirect, '_blank').focus();
                            } else {
                                document.location.href = result.redirect;
                            }
                        } else {
                            $('[data-ajax-load-page]').removeClass('disabled');
                            if (result.html) {
                                var content_page = result.html;
                                $('[data-main-content]').html(content_page).append('<div class="pleasewait"></div>');
                                var title = content_page.split('<!--BlockTitle', 2);
                                title = title.join('');
                                var title = title.split('BlockTitle-->', 1);
                                title = title.join( );
                                $('html head').find('title').text(title);
                            }
                            var main_content = document.getElementById("content");
                            main_content.scrollIntoView(true);
                        }
                        $(".pleasewait").fadeOut("slow");
                    }
                },
                {ajax_load_page: true, 'order_id': value_id}
        );
    });


    /*Real time count Unread Messages Files On Sidebar START*/
    /*Not Enable Now !!!*/
    function getCountMessagesFiles(orders) {
        var orders_id = [];
        $.each(
                orders,
                function (iter, order_data) {
                    orders_id.push(order_data.id);
                }
        );
        callAjax(
                'json',
                '/my_orders?ajax=getCountMessagesFilesByOrderId',
                function (data) {
                    if (data && data.orders) {
                        var sum_unreaded = 0;
                        $.each(
                                data.orders,
                                function (order_id, order_data) {
                                    if (order_data.writer_messages_unreaded || order_data.writer_files_unreaded) {
                                        $('[data-order-item][data-id="' + order_id + '"]').find('[data-counter]').html(order_data.writer_files_unreaded * 1 + order_data.writer_messages_unreaded * 1).show();
                                        sum_unreaded = sum_unreaded + order_data.writer_files_unreaded * 1 + order_data.writer_messages_unreaded * 1;
                                    }
                                }
                        );
                        if (sum_unreaded > 0) {
                            $('[data-summary_counter]').html(sum_unreaded).show();
                        }
                    }
                },
                {orders_id: orders_id}
        );
    }

    $(document).on("click", "#managers_unavail_close", function () {
        callAjax(
                'json', '/profile?ajax=CloseManagersUnavailBanner',
                function (data) {
                    if(data.result === true){
                        $("#managers_unavail_banner").remove();
                    }                    
                }
        );
    })

    var block_orders = $('[data-order-item]');
    var loaded_orders = [];
    $.each(
            block_orders,
            function (iter, order_data) {
                loaded_orders.push({id: $(order_data).data('id')});
            }
    );
    //getCountMessagesFiles(loaded_orders);  
    /*Real time count Unread Messages Files On Sidebar END*/

    /*Ajax load page content START*/
    $(document).on("click", "[data-ajax-load-page]", function (event) {
        if ($(event.target).attr('data-no-event-click')) {
            event.stopPropagation();
            return false;
        }
        clickedPage = $(this).data('ajax-load-page');
        leaveTab();

        if (window.location.pathname.replace('/', '') == 'quiz' && $('.knowledge-quiz-preview:hidden').length > 0) {
            quizPageLeave(clickedPage);
            return false;
        } else {
            if($('.knowledge-quiz-banner').length > 0) {
                $('.knowledge-quiz-banner').show();
            }
        }

        if (!tabValid) {
            return false;
        }

        clickedPage = null;

        if (history.pushState) {
            if ($(this).hasClass('disabled')) {
                return false;
            }
            var ajax_page = $(this).data('ajaxLoadPage');
            
            $('.sidebar-top a,.sidebar-top li').removeClass('active');
            $('.sidebar-top a[data-order-item]').removeClass('current');
            var page_link = ajax_page.match('[a-z_0-9-]+');
            $("body").attr("data-name-loaded-page", (page_link[0] !== undefined) ? page_link[0] : '');
            if (page_link[0]) {
                $(".sidebar-top li a").each(function (index) {
                    var link_to_page = $(this).attr('data-ajax-load-page');
                    if (link_to_page && link_to_page.indexOf(page_link[0]) > -1) {
                        if (page_link[0] == 'my_orders') {
                            $(this).parent('li').addClass('active');
                            if (ajax_page.indexOf('subcom=detailed') > -1 && ajax_page == $(this).attr('data-ajax-load-page')) {
                                $(this).parents('li').addClass('active');
                                $(this).addClass('current');
                            }
                        } else {
                            $(this).addClass('active');
                        }
                    }
                });

            }

            $('[data-ajax-load-page]').addClass('disabled');
            callAjax(
                    'html',
                    ajax_page,
                    function (data) {
                        var isValidJSON = data ? true : false;
                        try {
                            JSON.parse(data)
                        } catch (e) {
                            isValidJSON = false
                        }
                        if (isValidJSON) {
                            var result = JSON.parse(data);
                            if (result.redirect) {
                                document.location.href = result.redirect;
                            } else {
                                $('[data-ajax-load-page]').removeClass('disabled');
                                $('.container-fluid[data-main-content]').removeClass('container-ajax-list'); 
                                if (result.html) {
                                    var content_page = result.html;
                                    $('[data-main-content]').html(content_page).append('<div class="pleasewait"></div>');
                                    var title = content_page.split('<!--BlockTitle', 2);
                                    title = title.join('');
                                    var title = title.split('BlockTitle-->', 1);
                                    title = title.join( );
                                    $('html head').find('title').text(title);
                                }
                                
                                if (ajax_page != '/settings' && result.variables.current_user.pay_method && !result.variables.current_user.billing_address1) {
                                    $('[data-banner-sbumit-billing-details]').fadeIn(200);                                        
                                } else{
                                    $('[data-banner-sbumit-billing-details]').fadeOut(200);
                                }

                                if (result.variables.avail_order) {
                                    ORDER = result.variables.avail_order;
                                    var is_ajax_loaded_content = true;
                                    initOrderDetailed(is_ajax_loaded_content);
                                    showButtonSeeMore();
                                }

                                if (result.variables.ticket) {
                                    TICKET = result.variables.ticket;
                                    changeSidebarData();
                                }

                                if (result.variables.current_user.news_unreaded) {
                                    updateNewsCounter(parseInt(result.variables.current_user.news_unreaded));
                                }

                                if (result.variables.current_user.phone_verified != 1 && !result.variables.current_user.phone_verified_modal_shown && CURRENT_USER.status == 20) {
                                    //showModalVerifyPhone(result.variables.current_user);
                                }
 
                                if (ajax_page == '/my_orders') {
                                    $('.container-fluid[data-main-content]').addClass('container-ajax-list'); 
                                    myOrdersList('active');
                                    select2CustomSingle();
                                    select2CustomMulti();
                                    getCountMessagesFilesByStatusOrder();
                                    loadOrdersByScroll();                                    
                                } else if (ajax_page == '/available_orders') {
                                    $('.container-fluid[data-main-content]').addClass('container-ajax-list'); 
                                    check_count_available_orders_in_sidebar = true;
                                    availableOrdersList();
                                    savedSearches();
                                    select2CustomSingle();
                                    select2CustomMulti();
                                    checkForSavedFiltersChanges();
                                    showFormatListOrders();
                                    loadOrdersByScroll();                                    
                                } else if (// if detailed page
                                        ajax_page != '/available_orders'
                                        && ajax_page != '/my_orders'
                                        && (
                                                ajax_page.indexOf('/available_orders') !== -1
                                                || ajax_page.indexOf('/my_orders') !== -1
                                                )
                                        ) {
                                    select2CustomSingle();
                                    select2CustomMulti();
                                    initTabsListOrderDetails();                             
                                } else if (ajax_page == '/invitations') {
                                    cleanInvitationPage();
                                    InvitationsList();
                                    InvitationsListByScroll();
                                } else if (ajax_page == '/tickets') {
                                    ticketsList();
                                    loadOrdersByScroll();
                                    select2CustomMulti();
                                    initMessagesTabHolders();
                                } else if (ajax_page == '/news') {
                                    $(".orders-wrapper .news-item .three-lines").truncate({
                                        lines: 3
                                    });
                                } else if (ajax_page == '/settings' || ajax_page.indexOf('/settings?tab') !== -1) {
                                    if (result.variables.current_user.pay_method && result.variables.current_user.pay_method!=0) {
                                        altPayment = 1;
                                    } else {
                                        altPayment = 0;
                                    } 
                                    if(ajax_page.indexOf('to=block_contact_info') !== -1){
                                        var block_contcat_info_position = $('[data-block-contact-info]').position().top;
                                         $('#content-wrapper').animate({
                                            scrollTop: 50 + block_contcat_info_position
                                        }, 500);
                                    }
                                    initSelect2TimeZoneCustomJs();
                                    initSelect2CountryCodeJs();
                                    select2CustomSingle();
                                    select2CustomMulti();
                                    initSettings();
                                } else if (ajax_page == '/my_balance') {
                                    initializeDaterangePickerPayments();
                                    select2CustomMulti();
                                    myBalanceList();
                                } else if (ajax_page == '/contact_us') {
                                    headerHideBtns();
                                } else if (ajax_page == '/performance_overview') {
                                    initPerformanceOverview();
                                    if (result.variables.flow_higher_levels) {
                                        setListFlowHigherLevels(result.variables.flow_higher_levels);
                                    }
                                } else if(ajax_page.indexOf('/quiz?subcom=pass') !== -1) {
                                    $('.knowledge-quiz-banner').hide();
                                }else if (ajax_page == '/useful_materials') {
                                    $("#content-wrapper").addClass("bg-light");
                                    $("#content").addClass("bg-light");
                                    // usefulMaterialsCollapseScroll();
                                }                           
                                var main_content = document.getElementById("content");
                                main_content.scrollIntoView(true);
                                var page_title = $('html head').find('title').text() ? $.trim($('html head').find('title').text()) : 'Page Title';
                                window.history.pushState({}, page_title, ajax_page);                                
                            }
                            $(".pleasewait").fadeOut("slow");
                            initRtnForCustomPages();
                        }
                    },
                    {ajax_load_page: true}
            );
        } else {
            document.location.href = $(this).data('ajaxLoadPage');
        }
        return false;
    });
    /*Ajax load page content END*/

    /*Preload START*/
    var current_pathname = $("body").attr("data-name-loaded-page") != '' ? $("body").attr("data-name-loaded-page") : window.location.pathname;
    $("body").attr("data-name-loaded-page", current_pathname);
    switch (current_pathname) {
        case 'my_orders':
            myOrdersList('active');
            getCountMessagesFilesByStatusOrder();
            loadOrdersByScroll();
            if (getParameterByName('subcom') == 'detailed') {
                initOrderDetailed();
                showButtonSeeMore();
            }else{
                $('.container-fluid[data-main-content]').addClass('container-ajax-list'); 
            }
            break;
        case 'invitations':
            InvitationsList();
            InvitationsListByScroll();
            break;
        case 'available_orders':
            //case $("body").attr("data-name-loaded-page"):
            availableOrdersList();
            savedSearches();
            loadOrdersByScroll();
            if (getParameterByName('subcom') == 'detailed') {
                initOrderDetailed();
                showButtonSeeMore();
            }else{
                $('.container-fluid[data-main-content]').addClass('container-ajax-list'); 
            }
            break;
        case 'tickets':
            ticketsList();
            loadOrdersByScroll();
            if (getParameterByName('subcom') == 'detailed') {
                initMessagesTabHolders();
            }
        case 'settings':
            initSettings();
            break;
        case 'test':
            initTest();
            break;
        case 'my_balance':
            initializeDaterangePickerPayments();
            myBalanceList();
            break;
        case 'performance_overview':
            initPerformanceOverview();
            break;
        default:
            $("body").attr("data-name-loaded-page", '');
            break;
    }
    initRtnForCustomPages();
    /*Preload END*/

    /*Select2 START*/
    $(document).on("select2:unselect select2:select", ".select2-custom-multi", function (e) {
        var uldiv = $(this).siblings('span.select2').find('ul');
        var count = uldiv.find('li').length - 1;
        if ($(this).hasClass('select2-multi-search')) {
            $(this).parent().find('.select2-selection__choice').addClass('d-none');
            $(this).parent().find('.select2-search__field').addClass('select2-search__field-active');
        } else {
            if (count > 1) {
                $(this).parent().find('.select2-selection__choice').addClass('d-none');
                uldiv.prepend("<li class='select2-selection__choice select2-choice-count'>" + count + " items selected</li>");
            }
        }
        if (e.type == 'select2:select') {
            var element_data = e.params.data;
            var select_id = $(this).attr('id');

            $(this).siblings('.select2-container').find('.selected-holder').append('<p class="active-new" data-value="' + element_data.id + '" data-referer="' + element_data.id + '" data-select-id="' + select_id + '" onclick="removeSelectedElement.call(this);">' + element_data.text + '</p>');

            var selectedValues = $(this).val();

            if (selectedValues.length > 0) {
                if (selectedValues.indexOf('any') > -1) {
                    if (element_data.id == 'any') {
                        $(this).val(null);
                        $(this).find('option[value="any"]').prop('selected', true);
                    } else {
                        $(this).find('option[value="any"]').prop('selected', false);
                        $(this).find('option[value="any"]').trigger('click');
                    }
                    select2CustomMulti();
                    select2CustomMultiPresetItems();
                    $(this).select2("open");
                }
            }
        }
        if (e.type == 'select2:unselect') {
            var element_data = e.params.data;
            var referer_id = element_data._resultId;
            //$(this).siblings('.select2-container').find('.active-new[data-referer="' + referer_id + '"]').detach();
            $(this).siblings('.select2-container').find('.active-new[data-value="' + element_data.id + '"]').detach();
            var selectedValues = $(this).val();
            if (!selectedValues) {
                $(this).val("any").trigger('change.select2');
                select2CustomMulti();
                select2CustomMultiPresetItems();
                $(this).select2("open");
            }
        }
    });

    $(document).on("select2:open select2:unselect select2:select", ".select2-custom-multi", function (e) {
        if ($(this).hasClass('select2-multi-search')) {
            var selectOpenPlaceholde = $(this).data('placeholder');
            $(this).parent().find('.select2-choice-count, .select2-selection__choice').addClass('d-none');
            $(this).parent().find('.select2-search__field')
                    .addClass('select2-search__field-active')
                    .attr('placeholder', selectOpenPlaceholde);
            $(this).parent().find('select2-multi-search').removeClass('d-none');
        }
    });

    $(document).on("select2:close", ".select2-custom-multi", function (e) {
        if ($(this).hasClass('select2-multi-search')) {
            var uldiv = $(this).siblings('span.select2').find('ul');
            //var count = uldiv.find('li').length - 1;
            var count = $(this).select2('data').length;
            $(this).parent().find('.select2-search__field').removeClass('select2-search__field-active');
            $(this).parent().find('.select2-choice-count, .select2-selection__choice').addClass('d-none');
            if (count > 1) {
                $(this).parent().find('.select2-selection__choice').addClass('d-none');
                uldiv.prepend("<li class='select2-selection__choice select2-choice-count'>" + count + " items selected</li>");
            } else {
                $(this).parent().find('.select2-selection__choice').removeClass('d-none');
            }
        } else {

        }
    });
    /*Select2 END*/

});


// available orders page scripts
function array_diff(a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }
    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
}

// veriables
var getWindowWidth = $(window).width();
// END veriables

// remove selected element
function removeSelectedElement() {
    var select = $("#" + $(this).attr('data-select-id'));
    select.siblings('.select2-container').find('.active-new[data-value="' + $(this).data('value') + '"]').detach();
    var old_values = select.val();
    var removing_element = [];
    removing_element.push($(this).attr('data-value'));
    var new_values = array_diff(old_values, removing_element);
    if (!new_values || (typeof new_values !== 'undefined' && new_values.length == 0)) {
        select.val("any").trigger('change.select2');
    } else {
        select.val(new_values).trigger('change.select2');
    }
    select2CustomMulti();
    select2CustomMultiPresetItems();
    select.select2("open");
}
// END remove selected element

// select2 for filters
function select2CustomSingle() {
    $('.select2-custom-single').each(function (e) {
        var $parentInput = $(this).closest('.filter-single-inner');
        $(this).select2({
            minimumResultsForSearch: Infinity,
            placeholder: "Select",
            dropdownCssClass: 'single-filter-dropdown',
            dropdownParent: $parentInput
        });
    });
}
select2CustomSingle();

function select2CustomMulti() {
    $('.select2-custom-multi').each(function (e) {
        var $parentMultiple = $(this).closest('.filter-single-inner');
        var showSelected = $(this).data('showSelected');
        var select_id = $(this).attr('id');
        var select_object = $(this);
        $(this).select2({
            dropdownParent: $parentMultiple,
            dropdownCssClass: 'multiple-filter-dropdown',
            minimumResultsForSearch: Infinity,
            matcher: matchCustom,
            "language": {
                "noResults": function () {
                    $('.selected-holder').hide();
                    return "No results found";
                }
            },
            templateResult: function (data, container) {
                if (data.id == 'any' && showSelected) {
                    var ulParent = select_object.siblings('.select2-container').find('.select2-results__options');
                    var selectedHolder = document.createElement('div');
                    selectedHolder.className = "selected-holder";
                    ulParent.prepend(selectedHolder);
                }
                if (showSelected && data.selected) {
                    var ulParent = select_object.siblings('.select2-container').find('.select2-results__options');
                    ulParent.find('.selected-holder').append('<p class="active-new" data-value="' + data.id + '" data-referer="' + data.id + '" data-select-id="' + select_id + '" onclick="removeSelectedElement.call(this);">' + data.text + '</p>');
                }
                return data.text;
            },

            closeOnSelect: false
        });
    });
}
select2CustomMulti();

// remove search option for type-of-work select
//     $('#type-of-work').on('select2:opening select2:closing', function (event) {
//         var $searchfield = $(this).parent().find('.select2-search__field');
//         $searchfield.prop('disabled', true);
//     });
// END remove search option for type-of-work select


function select2CustomMultiPresetItems(count) {
    $('.select2-custom-multi').each(function (e) {
        var uldiv = $(this).siblings('span.select2').find('ul');
        var count = count || uldiv.find('li').length - 1;
        /*if ($(this).hasClass('select2-multi-search')) {
         $(this).parent().find('.select2-selection__choice').addClass('d-none');
         $(this).parent().find('.select2-search__field').addClass('select2-search__field-active');
         } else {
         if (count > 1) {
         $(this).parent().find('.select2-selection__choice').addClass('d-none');
         uldiv.prepend("<li class='select2-selection__choice select2-choice-count'>" + count + " items selected</li>");
         }
         }*/
        if (count > 1) {
            $(this).parent().find('.select2-selection__choice').addClass('d-none');
            uldiv.prepend("<li class='select2-selection__choice select2-choice-count'>" + count + " items selected</li>");
        }
    });
}

select2CustomMultiPresetItems();

// END of select 2

// search in select2
function matchCustom(params, data) {

    var parent_select2 = $(data.element).parent('select');
    if (parent_select2.data('validLatin') && params.term && params.term.match(/[^A-Za-z]/g)) {
        params.term = params.term.replace(/[^A-Za-z]/g, '');
        params.term = params.term;
    }

    if ($.trim(params.term) === '') {
        $('.selected-holder').show();
        return data;
    } else {
        $('.selected-holder').remove();
    }

    if (typeof data.children === 'undefined') {
        if (data.text.toLowerCase().indexOf(params.term.toLowerCase()) !== -1) {
            var modifiedData = $.extend({}, data, true);
            return modifiedData;
        }
    } else {
        var filteredChildren = [];
        $.each(data.children, function (idx, child) {
            if (child.text.toLowerCase().indexOf(params.term.toLowerCase()) !== -1) {
                filteredChildren.push(child);
            }
        });
        if (filteredChildren.length) {
            var modifiedData = $.extend({}, data, true);
            modifiedData.children = filteredChildren;
            return modifiedData;
        }
    }

    return null;
}

// END search in select2

$(document).on("click", ".del-seted-filter", function () {

    var is_changed = false;

    var field_name_clear = $(this).parent().data('filterSetItemField');
    if (field_name_clear) {
        var url_current = new URL(document.location.href);
        var params = new URLSearchParams(url_current.search.slice(1));
        field_name_clear = field_name_clear.replace(/\[/g, '');
        field_name_clear = field_name_clear.replace(/\]/g, '');
        params.delete('search_history[' + field_name_clear + '][]');

        var filed_value = $(this).parent().find('[data-filter-set-text]').text();
        $(this).parent().detach();
        if ($('[data-filter-set-block]').find('[data-filter-set-item]').length < 1) {
            $('[data-filter-set-block]').hide();
        }

        $("[data-filter-set-block] div[data-filter-set-item-field='" + field_name_clear + "']").each(function (index) {
            if ($.trim($(this).find('[data-filter-set-text]').text()) != '') {
                params.append('search_history[' + field_name_clear + '][]', $.trim($(this).find('[data-filter-set-text]').text()));
            }
        });

        //if($('#form-available-orders').length){
        if (field_name_clear == 'pages_from_pages_to') {
            params.delete('pages_from');
            params.delete('pages_to');
            $('#form-available-orders').find('input[name="pages_from"]').val(1).trigger('change');
            $('#form-available-orders').find('input[name="pages_to"]').val('').trigger('change');
            changePlaceholderPage();
            is_changed = true;
        } else {
            params.delete(field_name_clear);

            if ($("input[name='" + field_name_clear + "']").length) {
                if ($("input[name='" + field_name_clear + "']").parents('form').find("input[name='" + field_name_clear + "']").attr('type') == 'text') {
                    $("input[name='" + field_name_clear + "']").parents('form').find("input[name='" + field_name_clear + "']").val('');
                } else {
                    $("input[name='" + field_name_clear + "']").parents('form').find("input[name='" + field_name_clear + "']:checkbox").prop('checked', false);
                }
                is_changed = true;
            }

            if ($('select[name="' + field_name_clear + '[]"]').length) {

                $('select[name="' + field_name_clear + '[]"] option').each(function () {
                    if ($(this).text() == filed_value) {
                        $(this).prop("selected", false);
                        is_changed = true;
                    }
                });

                if (is_changed) {
                    if ($('select[name="' + field_name_clear + '[]"] :selected').length == 0) {
                        $('select[name="' + field_name_clear + '[]"]').val("any").trigger('change.select2');
                    } else {
                        $('select[name="' + field_name_clear + '[]"]').trigger('change.select2');
                        select2CustomMultiPresetItems();
                    }
                }
            }
        }
        //}         

    } else {
        $(this).parent().detach();
        if ($('[data-filter-set-block]').find('[data-filter-set-item]').length < 1) {
            $('[data-filter-set-block]').hide();
        }

        var url_current = new URL(document.location.href);
        var params = new URLSearchParams(url_current.search.slice(1));

        params.delete('search_history[string][]');
        params.delete('search_history[status][]');

        $("[data-filter-set-block] div[data-filter-set-item]").each(function (index) {
            if ($(this).data('filterSetItemStatus')) {
                if ($.trim($(this).find('[data-filter-set-text]').text()) != '') {
                    params.append('search_history[status][]', $.trim($(this).find('[data-filter-set-text]').text()));
                }
            } else {
                if ($.trim($(this).find('[data-filter-set-text]').text()) != '') {
                    params.append('search_history[string][]', $.trim($(this).find('[data-filter-set-text]').text()));
                }
            }
        });
    }

    if (params.toString()) {
        window.history.pushState({}, "Page Title", url_current.pathname + '?' + params);
    } else {
        window.history.pushState({}, "Page Title", url_current.pathname);
    }

    if (is_changed && !clear_all_button_click) {
        if ($('[data-button-submit-form-available-filter]').length) {
            $('[data-button-submit-form-available-filter]').trigger('click');
        } else if ($('[data-button-submit-form-filter]').length) {
            $('[data-button-submit-form-filter]').trigger('click');
        }

    }
});

$(document).on("change keyup", "[data-valid-latin-digit]", function () {
    var new_value = $(this).val();
    if (new_value && new_value.match(/[^A-Za-z0-9!@#\$%\^&\*\(\)_|}{~">:;,.'<\?/\]\[\\=\-+` ]/g)) {
        new_value = new_value.replace(/[^A-Za-z0-9!@#\$%\^&\*\(\)_|}{~">:;,.'<\?/\]\[\\=\-+` ]/g, '');
        $(this).val(new_value);
    }
});

$(document).on("keyup", ".select2-search__field", function () {
    var parent_select2 = $(this).parents('.select2-container').siblings('select');
    if (parent_select2.data('validLatin')) {
        var new_value = $(this).val();
        if (new_value && new_value.match(/[^A-Za-z]/g)) {
            new_value = new_value.replace(/[^A-Za-z]/g, '');
            $(this).val(new_value);
        }
    }
});

$(document).on("change keyup", "[data-only-digit]", function () {
    var new_value = $(this).val();
    if (new_value && new_value.match(/[^0-9]/g)) {
        new_value = new_value.replace(/[^0-9]/g, '');
        $(this).val(new_value);
    }
    if (new_value == 0 && !($(this).val() == '' && $(this).data('defaultValue') == 'max')) {
        $(this).parents('[data-input-group]').find('[data-minus-button]').addClass('button-addon-disabled');
    } else if (new_value > 0 || ($(this).val() == '' && $(this).data('defaultValue') == 'max')) {
        $(this).parents('[data-input-group]').find('[data-minus-button]').removeClass('button-addon-disabled');
    }

    if (new_value == $(this).data('maxValue') || ($(this).val() == '' && $(this).data('defaultValue') == 'max')) {
        $(this).parents('[data-input-group]').find('[data-add-button]').addClass('button-addon-disabled');
    } else {
        $(this).parents('[data-input-group]').find('[data-add-button]').removeClass('button-addon-disabled');
    }
});


$(document).on("click", "[data-minus-button]", function () {
    var input_value = $(this).parents('[data-input-group]').find("[data-only-digit]");
    if (input_value.val() == '' && input_value.data('defaultValue') == 'max' && input_value.data('maxValue')) {
        input_value.val(input_value.data('maxValue'));
    }
    var value_sources = input_value.val() * 1;
    if (value_sources > 0) {
        input_value.val(value_sources - 1);
        input_value.change().trigger("input");
        if (input_value.val() == 0) {
            $(this).addClass('button-addon-disabled');
        } else {
            $(this).removeClass('button-addon-disabled');
        }
        $(this).parents('[data-input-group]').find('[data-add-button]').removeClass('button-addon-disabled');
    } else {
        $(this).addClass('button-addon-disabled');
    }
});

$(document).on("click", "[data-add-button]", function () {
    if ($(this).hasClass('button-addon-disabled')) {
        return false;
    }
    var input_value = $(this).parents('[data-input-group]').find("[data-only-digit]");
    var new_value_sources = input_value.val() * 1 + 1;
    if (new_value_sources.toString().length <= input_value.attr("maxlength") || input_value.attr('data-not-check-max-length') == 1) {
        if (input_value.data('maxValue') && new_value_sources > input_value.data('maxValue')) {
            new_value_sources = input_value.data('maxValue');
        }
        input_value.val(new_value_sources);
        input_value.change().trigger("input");
        if (new_value_sources == input_value.data('maxValue')) {
            $(this).addClass('button-addon-disabled');
        } else {
            $(this).removeClass('button-addon-disabled');
        }
        $(this).parents('[data-input-group]').find('[data-minus-button]').removeClass('button-addon-disabled');
    } else {
        $(this).addClass('button-addon-disabled');
    }
});

/*Main js END*/

function changeSidebarData() {
    callAjax(
            'html',
            '/update?subcom=sidebar',
            function (data) {
                $('[data-content-sidebar]').html(data);
                showMyOrders();
                var current_pathname = $("body").attr("data-name-loaded-page") != '' ? $("body").attr("data-name-loaded-page") : window.location.pathname;
            },
            {current_title: $('[data-name-loaded-page]').attr('data-name-loaded-page')}
    );
}

function forceAssignOrderRTNHandler(data, event) {
    var currentPageForcedOrder = (typeof data.order_id != 'undefined')
            && window.location.pathname.replace('/', '') == 'orders_available'
            && getParameterByName('subcom') == 'detailed'
            && getParameterByName('id') == data.order_id;    
    if (currentPageForcedOrder) {
            setTimeout(function () {
                redirect('/my_orders?subcom=detailed&id=' + data.order_id);
            }, 2000);
    }
}

function updateNewsCounter(news_count) {
    var news_counter_block = $("#accordionSidebar [data-count-news]");

    if (news_count > 0) {
        news_counter_block.html(news_count).show();
    } else {
        news_counter_block.html(news_count).hide();
    }
}

function getParameterByName(name, url) {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

function redirect(url) {
    $(".ready-for-redirect").remove();
    $("<a style='display:none'></a>")
            .addClass('ready-for-redirect')
            .attr("data-ajax-load-page", url)
            .appendTo('body')
            .click();
}

function loadOrdersByScroll() {
    $('#content-wrapper').scroll(function () {
        if ($('.order-main-wrap').find('.list-content').attr('data-all-items-loaded') == 'false') {
            var add_to_scroll = $('body').attr('data-name-loaded-page') == 'tickets' ? 300 : 500;
            if ($("#content-wrapper .list-content")[0].scrollHeight > 0 &&
                    $("#content-wrapper").scrollTop() > ($("#content-wrapper .list-content")[0].scrollHeight - $("#content-wrapper")[0].offsetHeight + add_to_scroll)
                    ) {
                if ($('body').attr('data-name-loaded-page') == 'my_orders') {
                    append_order_list = true;
                    myOrdersList($('[data-tab-my-orders] li.current').data('tabStatus'));
                } else if ($('body').attr('data-name-loaded-page') == 'available_orders') {
                    append_available_order_list = true;
                    availableOrdersList();
                } else if ($('body').attr('data-name-loaded-page') == 'tickets') {
                    append_ticket_list = true;
                    ticketsList();
                }
            }
        }
    });
}

function checkForLatin(input_str) {
    var regexp = new RegExp(/^([a-zA-Z0-9\!\@\#\№\s\$\%\^\&\*\(\)\_\+\-\=\\\/\|\[\]\{\}\;\:\'\"\,\.\<\>\?\ ])+$/g);
    return regexp.test(input_str);
}

function enableButton() {
    $(this).removeAttr('disabled').css('pointer-events', 'auto');
}
function disableButton() {
    $(this).attr('disabled', true).css('pointer-events', 'none');
}

function headerHideBtns() {
    if ($.inArray(CURRENT_USER.status, ['10', '20', '30']) + 1) {
        $('.topbar-info .topbar-info__item, .navbar-nav .nav-item-search').hide();
    }
}
function headerShowBtns() {
    if ($('.topbar-info .topbar-info__item, .navbar-nav .nav-item-search').is(':hidden')) {
        $('.topbar-info .topbar-info__item, .navbar-nav .nav-item-search').show();
    }
}

$(window).on('load', function (e) {
    $(".pleasewait").fadeOut("slow");
})

$(document).on('click', "#ModalDiscardChanges button[type='submit']", function () {

    $("#tab-2").find('.qualification-box').each(function () {
        $(this).hide();
        $(this).parents('.shadow-box-table').find('[data-lang-btns]').hide();
        $(this).parents('.order-option-value').find('.option-value-text, [data-sett-edit]').fadeIn(300);
        $(this).parents('.order-details-block').find("[data-verify-email]").show();
        $(this).parents('.shadow-box-language').find("[data-edit-languages]").show();
    });
    $("#tab-3").find('.payment-box-active').removeClass('payment-box-active');
    $("#tab-3").find('.payment-box-dissabled').removeClass('payment-box-dissabled');
    tabValid = true;
    $("#ModalDiscardChanges").modal('hide');
    if (clickedTab) {
        $('[data-tab="tab-' + clickedTab + '"]').click();
    }

    if (clickedPage) {
        $('[data-ajax-load-page="' + clickedPage + '"]').click();
    }
});

function quizPageLeave(clickedPage) {
    $("#KnowledgeTestLeaving").modal("show");
    $("#KnowledgeTestLeaving").find(".btn-red").attr("data_leave_href", clickedPage);
    $(window).off("beforeunload");
}

function validateButtonSubmit($form) {
    if ($form.validate().checkForm()) {
        $form.find('[data-submit-form]').removeClass('submit_btn-disabled');
    } else {
        $form.find('[data-submit-form]').addClass('submit_btn-disabled');
    }
}

function parseBytes(bytes) {
    var size_type = 'kB';

    if (bytes > 1000000) {
        bytes = parseFloat(bytes / 1000000).toFixed(2);
        size_type = 'MB';
    } else {
        bytes = parseFloat(bytes / 1000).toFixed(2);
    }


    return {size: bytes, size_type: size_type};
}

function rus_to_latin(str) {

    var ru = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i', 'і': 'i',
        'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh',
        'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya'
    }, n_str = [];

    str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i');

    for (var i = 0; i < str.length; ++i) {
        n_str.push(
                ru[ str[i] ]
                || ru[ str[i].toLowerCase() ] == undefined && str[i]
                || ru[ str[i].toLowerCase() ].replace(/^(.)/, function (match) {
            return match.toUpperCase()
        })
                );
    }

    return n_str.join('');
}



function notify(settings){
    console.log('notify', true);
	var holder = $('#notify-holder');
	var template = holder.find('.template');

	var notify = template.clone();
	notify.find('.body').html(settings.text);

	notify.removeClass('template');
	notify.addClass(settings.type);

	var rand_id = ('notify'+Math.random()).replace('.','');
	notify.attr('id',rand_id);

	if(settings.type == 'newFile') {
		notify.find('.icon-holder i').removeClass('fa-info').addClass('fa-file');
	} else if (settings.type == 'newMessage') {
		notify.find('.icon-holder i').removeClass('fa-info').addClass('fa-envelope');
	} else if (settings.type == 'orderStatusChanged') {
		notify.find('.icon-holder i').removeClass('fa-info').addClass('fa-flag');
	}

	if(settings.link){
		notify.css('cursor','pointer');
		notify.find('.notify-item-holder').click(function(){
				window.location.href = settings.link;
			}
		);
	}

	holder.prepend(notify);

	notify.removeClass('hide');

	notify.hover(function(){
		if($(this).hasClass('hover')) {
			$(this).removeClass('hover');
		} else {
			$(this).addClass('hover');
		}
	});

	return rand_id;
};

//scroll accordion header to top on mobile
$(document).on("shown.bs.collapse", ".collapse", function(){
    var $card = $(this).closest('.card');
    var h_height = $(this).closest('.tab-pane').find(".title").outerHeight();
    var t = $card.position().top;
    if (getWindowWidth < 992) {
        if ($('#useful_materials').length > 0) {
            $('#content-wrapper').animate({
                scrollTop: t + 60
            }, 200);

            $(this).parents('.card').addClass('card-active');
        }
    }
});

$(document).on("hidden.bs.collapse", ".collapse", function(){
    if (getWindowWidth < 992) {
        if ($('#useful_materials').length > 0) {
            $(this).parents('.card').removeClass('card-active');
        }
    }
});

$(document).ready(function () {
    //HIDE Switch admins banner on scroll
    (function checkSwichBnrVisibility() {
        if ($('.old-version-banner').length > 0) {
            $('#content-wrapper').scroll(function () {
                if ($(this).scrollTop() > 0) {
                    $('.old-version-banner').addClass('old-version-banner-hiden');
                } else {
                    $('.old-version-banner').removeClass('old-version-banner-hiden');
                }
            });
        }
    })();
    //END HIDE Switch admins banner on scroll
    var windowWidth = $(window).width();
    if (windowWidth < 768) {
        $(".notifications-icon").on("click", function(){
            $("#wrapper").addClass("notifications-open");
        });
        $(".dismiss-notifications-btn").on("click", function(){
            $("#wrapper").removeClass("notifications-open");
        });        
    }
    
    $(".container-rtn .rtn-item").each(function(){
        $(this).on("click", function(){
            $(this).remove();
        });
    });
});
/*My Orders js START*/

document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    showFormatListOrders();
});

function showFormatListOrders() {
    //change order list view
    var view = document.querySelectorAll('.order-view-checker'),
            headerList = document.querySelector('.order-list-th'),
            //headerListApp = document.querySelector('.order-list-app'),
            orders = document.querySelectorAll('.order-item'),
            wrapper = document.querySelector('.order-main-wrap');
    //wrapperApp = document.querySelector('.order-main-approved');

    view.forEach(function (item, i, massive) {
        view[i].addEventListener('click', function (el) {
            for (i = 0; i < view.length; i++) {
                view[i].className = view[i].className.replace(" active", "");
            }
            this.classList.add("active");

            if (this.id == "order-list-large") {
                $('[data-only-show-mobile]').hide();
                headerList.style.opacity = 0;
                //headerListApp.style.opacity = 0;
                orders.forEach(function (item, i, massive) {
                    orders[i].classList.remove("short-view");
                    wrapper.classList.remove("short-wrap");
                    //wrapperApp.classList.remove("short-wrap");
                    if ($('body').attr('data-name-loaded-page') == 'available_orders') {
                        wrapper.classList.remove("short-wrap-new");
                    }
                });
            } else {
                $('[data-only-show-mobile]').show();
                headerList.style.opacity = 1;
                //headerListApp.style.opacity = 1;
                orders.forEach(function (item, i, massive) {
                    orders[i].classList.add("short-view");
                    wrapper.classList.add("short-wrap");
                    //wrapperApp.classList.add("short-wrap");
                    if ($('body').attr('data-name-loaded-page') == 'available_orders') {
                        wrapper.classList.add("short-wrap-new");
                    }
                });
            }
        });
    });
}

//my orders filter visibility
myOrdersFilterVisibility();

function myOrdersFilterVisibility() {
    var getTabs = $('.tab-link.current').attr('data-tab-status') == "active";
    if (getTabs) {
        $('[data-myorders-approved=""]').show();
        $('[data-filter-set-item-field="status"]').show();
        $('.order-list-inner .orders-caption').removeClass("sort-no");
    } else {
        $('[data-myorders-approved=""]').hide();
        $('[data-filter-set-item-field="status"]').hide();
        $('.order-list-inner .orders-caption').addClass("sort-no");
    }
}

//END my orders filter visibility

/*START Ajax list my Orders*/
var limit_from = 0;
var append_order_list = false;
function myOrdersList(tab) {
    if (is_loading)
        return false;
    $('[data-block-not-found-orders]').empty();
    $('[data-last-order]').hide();
    var holder = $('.order-main-wrap').find('.list-content');
    if (append_order_list) {
        limit_from = limit_from + 20;
        holder.append(loader);
    } else {
        holder.empty();
        holder.html(loader);
        limit_from = 0;
    }

    var query_string = $('#form-my-orders').find('[name="query_string"]').val();
    var sort_field = $('[data-select-sort-my-orders]').find('option:selected').data('sortField');
    var sort_direction = $('[data-select-sort-my-orders]').find('option:selected').data('sortDirection');
    var load_with_parametrs = false;
    
    if (tab == 'active') {
        var status = $('#form-my-orders').find('[name="status[]"]').val();
        if(query_string!='' || status.indexOf('any') == -1){
            load_with_parametrs = true;
        }
    } else {
        var status = null;
        var sort_field = null;
        var sort_direction = null;
        if(query_string!=''){
            load_with_parametrs = true;
        }
    }

    if (!append_order_list) {
        $('[data-counter-my-orders]').empty();
        if ($('#order-list-short').hasClass('active')) {
            $('.order-list-th').css('opacity', 0);
        }
    }
    is_loading = true;
    callAjax('json', '/my_orders?ajax=listOrders&page=', function (data) {
        is_loading = false;
        var tpl = new jSmart($('#orders_list_item_template').html());
        if (append_order_list) {
            holder.find('[data-loader-html]').remove();
        } else {
            holder.empty();
        }
        
        var last_status_category = false;
        $(".list-content [data-status-category").each(function (index) {
            var prev_category = $(this).data('statusCategory');
            last_status_category = prev_category;
        });
        
        for (i in data.orders.data) {
            var key_name = "orders";
            var template_values = {};
            template_values[key_name] = data.orders.data[i];
            template_values.current_user = CURRENT_USER;
            template_values.short_view = $('#order-list-short').hasClass('active');
            template_values.last_status_category = last_status_category;            
            item_html = tpl.fetch(template_values);
            holder.append(item_html);
        }
        if (!append_order_list) {
            if (data.all_orders_count == 0) {
                $('[data-counter-my-orders]').html(0 + ' found');
                $('[data-block-order-list-filters]').addClass('no-orders');
            } else {
                $('[data-block-order-list-filters]').removeClass('no-orders');
                $('[data-counter-my-orders]').html(data.all_orders_count > 1 ? data.all_orders_count + ' found' : data.all_orders_count + ' found');
                if ($('#order-list-short').hasClass('active')) {
                    $('.order-list-th').css('opacity', 1);
                }
            }
            if (data.all_orders_count == 0) {
                if (use_filter_form || load_with_parametrs) {
                    var tpl = new jSmart($('#not_found_by_filter').html());
                    var item_html = tpl.fetch();
                    $('[data-block-not-found-orders]').append(item_html);
                    use_filter_form = false;
                    load_with_parametrs = false;
                } else if (tab == 'approved') {
                    var tpl = new jSmart($('#not_found_approved_orders').html());
                    var item_html = tpl.fetch();
                    $('[data-block-not-found-orders]').append(item_html);
                } else if (tab == 'cancelled') {
                    var tpl = new jSmart($('#not_found_cancelled_orders').html());
                    var item_html = tpl.fetch();
                    $('[data-block-not-found-orders]').append(item_html);
                } else {
                    var tpl = new jSmart($('#not_found_active_orders').html());
                    var item_html = tpl.fetch();
                    $('[data-block-not-found-orders]').append(item_html);
                }
            }
        }
        if (tab == 'approved') {
            $(".order-main-wrap").addClass("order-main-approved");
        } else {
            $(".order-main-wrap").removeClass("order-main-approved");
        }
        if (tab == 'active') {
            $(".order-main-wrap").addClass("order-main-active");
        } else {
            $(".order-main-wrap").removeClass("order-main-active");
        }
        if (data.count < 20) {
            holder.attr('data-all-items-loaded', true);
            if (append_order_list) {
                $('[data-last-order]').show();
            }
        } else {
            holder.attr('data-all-items-loaded', false);
        }
        showFormatListOrders();
        select2CustomSingle();
        select2CustomMulti();
        select2CustomMultiPresetItems();
        append_order_list = false;
    }, {tab: tab, sort: sort_field, sort_dir: sort_direction, query_string: query_string, status: status, limit_from: limit_from});

    /*
     * request_data_parsed = typeof request_data !== 'undefined' ? request_data : {
     statuses: form_wrap.find("#status").val(),
     subject: form_wrap.find("#subject").val(),
     order: form_wrap.find("#sort").val(),
     order_dir: form_wrap.find(".sort-filter-wrap .sort-arrow").hasClass('sort-arrow-rotate') ? 'ASC' : 'DESC',
     page: page_orders
     };
     */

}


/*END Ajax list my Orders*/



$(document).on("click", "#order-list-short", function () {
    $.cookie('short_view', '1');
});

$(document).on("click", "#order-list-large", function () {
    $.cookie('short_view', '', {expires: -1});
});

$(document).on("keyup", "#form-my-orders [name='query_string']", function (event) {
    if (event.keyCode === 13) {
        $("[data-button-submit-form-filter]").click();
    }
});

$(document).on("change", "[data-select-sort-my-orders]", function () {
    myOrdersList($('[data-tab-my-orders] li.current').data('tabStatus'));
    var url_current = new URL(document.location.href);
    var params = new URLSearchParams(url_current.search.slice(1));
    params.delete('sort');
    params.delete('sort_dir');
    var sort_field = $('[data-select-sort-my-orders]').find('option:selected').data('sortField');
    var sort_direction = $('[data-select-sort-my-orders]').find('option:selected').data('sortDirection');
    if ($.trim(sort_field) != '') {
        params.set('sort', sort_field);
        params.set('sort_dir', sort_direction);
    }
    if (params.toString()) {
        window.history.pushState("object or string", "Page Title", url_current.pathname + '?' + params);
    } else {
        window.history.pushState("object or string", "Page Title", url_current.pathname);
    }
});

var use_filter_form = false;
$(document).on("click", "[data-button-submit-form-filter]", function () {
    use_filter_form = true;

    var url_current = new URL(document.location.href);
    var params = new URLSearchParams(url_current.search.slice(1));

    setFilterValuesString($('#form-my-orders'), 'query_string', params);
    if ($('[data-tab-my-orders] li.current').data('tabStatus') == 'active') {
        setFilterValuesString($('#form-my-orders'), 'status[]', params);
    }
    
    $("[data-filter-set-block] div[data-filter-set-item]").each(function (index) {
        var field_name_clear = $(this).data('filterSetItemField');
        field_name_clear = field_name_clear.replace(/\[/g, '');
        field_name_clear = field_name_clear.replace(/\]/g, '');
        if ($.trim($(this).find('[data-filter-set-text]').text()) != '') {
            params.append('search_history[' + field_name_clear + '][]', $.trim($(this).find('[data-filter-set-text]').text()));
        }
    });

    if (params.toString()) {
        window.history.pushState("object or string", "Page Title", url_current.pathname + '?' + params);
    } else {
        window.history.pushState("object or string", "Page Title", url_current.pathname);
    }

    myOrdersList($('[data-tab-my-orders] li.current').data('tabStatus'));
});

function getCountMessagesFilesByStatusOrder() {
    //var tab_statuses = ['active','approved','cancelled'];
    //for (i = 0; i < tab_statuses.length; i++) {
    callAjax(
            'json',
            '/my_orders?ajax=getCountMessagesFilesByStatusOrder',
            function (data) {
                if (data) {

                    if (data.count_unread_in_active) {
                        $('[data-counter-active]').html(data.count_unread_in_active).show();
                    }
                    if (data.count_unread_in_approved) {
                        $('[data-counter-approved]').html(data.count_unread_in_approved).show();
                    }
                    if (data.count_unread_in_cancelled) {
                        $('[data-counter-cancelled]').html(data.count_unread_in_cancelled).show();
                    }
                }
            }
    //,{tab: tab_statuses[i]}
    );
    //}            
}

/*My Orders js END*/
/*Available orders js START*/

$(document).on("click", "[data-toggle-filters]", function () {
    if (getWindowWidth >= 768) {
        $(this).toggleClass('btn-hide_filters-rotate');
        $(this).parents().find('.filters-inner').slideToggle('slow');
        if ($(this).hasClass('btn-hide_filters-rotate')) {
            $(this).text('Hide Filters');
        } else {
            $(this).text('Show Advanced Filters');
        }
    } else {
        $('.orders-wrapper').addClass('orders-filters-open');
        $(this).parents('.main-filter-area').find('.filters-inner').slideToggle(300);
        $(this).parents('.main-filter-area').addClass('main-filter-area-mob');
    }
});

/*WTF ? -- mobile filters fullscreen*/
$(document).on("click", "[data-close-mob-filters]", function () {
//    return false;
    $('.orders-wrapper').removeClass('orders-filters-open');
    $(this).parents('.main-filter-area').find('.filters-inner').slideToggle(300);
    $(this).parents('.main-filter-area').removeClass('main-filter-area-mob');
});
/*END WTF ? -- mobile filters fullscreen*/

//show saved filters collapse btn
function checkForSavedFiltersChanges() {
    if (getWindowWidth > 992) {
        if ($('.saved-filters-list').find('.saved-filter-name').length > 4) {
            $('.saved-filters-collapse').show();
        }
    } else if (getWindowWidth >= 768 && getWindowWidth <= 991) {
        if ($('.saved-filters-list').find('.saved-filter-name').length > 2) {
            $('.saved-filters-collapse').show();
        }
    } else {
        if ($('.saved-filters-list').find('.saved-filter-name').length > 1) {
            $('.saved-filters-collapse').show();
        }
    }
    setTimeout(checkForSavedFiltersChanges, 500);
}

checkForSavedFiltersChanges();
//END show saved filters collapse btn

$(document).on("click", ".saved-filters-collapse", function () {
    $(this).toggleClass('filters-collapse-active');
    $(this).parents().find('.saved-filters-list').toggleClass('saved-filters-list-collapsed');
});

$(document).on("click", ".saved-filter-inner", function () {
    $(this).parent().siblings().removeClass('saved-filter-active');
    $(this).parent().toggleClass('saved-filter-active');
});

$(document).on("click", "[data-clear-filter]", function () {
    //$(".set-filter-item").detach();
    clear_all_button_click = true;
    var parent_filter_block = $(this).parent('[data-filter-set-block]');
    parent_filter_block.find('[data-filter-set-item]').each(function (index) {
        $(this).find('.del-seted-filter').trigger('click');
    });    
    setDefaultValuesInForm($('#form-available-orders'));
    setDefaultValuesInForm($('#form-help-desk'));
});

function setDefaultValuesInForm(form){        
    $(".select2-multi-search").each(function() { $(this).val([]); });
    $('.select2-multi-search').val("any").trigger('change.select2');
    $(".select2-custom-multi").each(function() { $(this).val([]); });
    if(form.attr('id') == 'form-help-desk'){
        $('.select2-custom-multi').not("[name='status[]']").val("any").trigger('change.select2');   
        $(".select2-custom-multi[name='status[]']").val("active").trigger('change.select2');   
    }else{
        $('.select2-custom-multi').val("any").trigger('change.select2');
    }
    form.find("input:checkbox").prop('checked', false);
    form.find('input[name="pages_from"]').val(1).trigger('change');
    form.find('input[name="pages_to"]').val('').trigger('change');
    form.find('input[name="query_string"]').val('').trigger('change');    
    changePlaceholderPage();
    if(form.attr('id') == 'form-available-orders'){
        $('[data-button-submit-form-available-filter]').trigger('click');   
    }else if(form.attr('id') == 'form-help-desk'){
        $('[data-button-submit-form-tickets-filter]').trigger('click', ["set_default"]);
    }        
    clear_all_button_click = false;
}

//pages dropdown prevent close on click inside
$(document).on("click", ".dropdown-pages", function (e) {
    e.stopPropagation();
    
    changePlaceholderPage();    
    
    if ($('.dropdown-pages-wrap .dropdown-toggle').text() == 'Select') {
        $('.dropdown-pages-wrap').find('.dropdown-toggle').addClass('dropdown-toggle-placeholder');
    } else {
        $('.dropdown-pages-wrap').find('.dropdown-toggle').removeClass('dropdown-toggle-placeholder');
    }
});

$(document).on("change", "[name='pages_from'],[name='pages_to']", function (e) {
    changePlaceholderPage();    
});

function changePlaceholderPage(){
    var pages_from = $.trim($('[name="pages_from"]').val());
    var pages_to = $.trim($('[name="pages_to"]').val());
    
    if((pages_from == 0 || pages_from == 1 || pages_from == '') && (pages_to == 0 || pages_to == ''))
    {
        $('[data-content-pages]').text('Select');
    }else{
        if((pages_from == 1 || pages_from == '')){
            pages_from = 1;
        }

        if((pages_to == 0 || pages_to == '')){
            pages_to = 'max'; 
        }
        var page_text = ' page';
        if(pages_to > 1){
            page_text = ' pages';
        }
        $('[data-content-pages]').text($.trim(pages_from + ' - ' + pages_to + page_text));
    }    
}

// END pages dropdown    

var limit_from_available_order = 0;
var append_available_order_list = false;
function availableOrdersList() {
    if (is_loading)
        return false;

    $('[data-block-not-found-orders]').empty();
    $('[data-last-order]').hide();
    var holder = $('.order-main-wrap').find('.list-content');
    if (append_available_order_list) {
        limit_from_available_order = limit_from_available_order + 20;
        holder.append(loader);
    } else {
        holder.empty();
        holder.html(loader);
        limit_from_available_order = 0;
    }

    var sort_field = $('[data-select-sort-available-orders]').find('option:selected').data('sortField');
    var sort_direction = $('[data-select-sort-available-orders]').find('option:selected').data('sortDirection');

    var request_data = [$('#form-available-orders').serialize(), $.param({sort: sort_field, sort_dir: sort_direction, limit_from: limit_from_available_order})].join('&');

    if (!append_available_order_list) {
        $('[data-counter-my-orders]').empty();
        if ($('#order-list-short').hasClass('active')) {
            $('.order-list-th').css('opacity', 0);
        }
    }
    is_loading = true;
    $('[data-button-submit-form-available-filter] [data-search-applying]').text($('[data-button-submit-form-available-filter] [data-search-applying]').attr('data-search-applying'));
    $('[data-button-submit-form-available-filter] [data-spinner-form]').show();    
    callAjax('json', '/available_orders?ajax=listOrders', function (data) {
        is_loading = false;
        $('[data-button-submit-form-available-filter] [data-search-text]').text($('[data-button-submit-form-available-filter] [data-search-text]').attr('data-search-text'));
        $('[data-button-submit-form-available-filter] [data-spinner-form]').hide();
        var tpl = new jSmart($('#orders_list_item_template').html());
        if (append_available_order_list) {
            holder.find('[data-loader-html]').remove();
        } else {
            holder.empty();
        }
        for (i in data.orders) {
            var key_name = "order";
            var template_values = {};
            template_values[key_name] = data.orders[i];
            template_values.current_user = CURRENT_USER;
            template_values.short_view = $('#order-list-short').hasClass('active');
            item_html = tpl.fetch(template_values);
            holder.append(item_html);
        }
        if (!append_available_order_list) {
            var sidebarCount = $('[data-count-available-orders]');
            if (data.all_orders_count == 0) {
                if (check_count_available_orders_in_sidebar) {
                    sidebarCount.data('countAvailableOrders',0);
                    sidebarCount.text(0);
                    sidebarCount.hide();
                    check_count_available_orders_in_sidebar = false;
                }
                $('[data-counter-my-orders]').html(0 + ' found');
                $('[data-block-order-list-filters]').addClass('no-orders');
            } else {
                if (check_count_available_orders_in_sidebar) {
                    sidebarCount.data('countAvailableOrders',data.all_orders_count);
                    sidebarCount.text(data.all_orders_count);
                    sidebarCount.show();
                    check_count_available_orders_in_sidebar = false;
                }
                $('[data-block-order-list-filters]').removeClass('no-orders');
                $('[data-counter-my-orders]').html(data.all_orders_count > 1 ? data.all_orders_count + ' found' : data.all_orders_count + ' found');
                if ($('#order-list-short').hasClass('active')) {
                    $('.order-list-th').css('opacity', 1);
                }
            }
            if (data.all_orders_count == 0) {
                if (use_filter_form) {
                    var tpl = new jSmart($('#not_found_by_filter').html());
                    var item_html = tpl.fetch();
                    $('[data-block-not-found-orders]').append(item_html);
                    use_filter_form = false;
                } else {
                    var tpl = new jSmart($('#not_found_available_orders').html());
                    var item_html = tpl.fetch();
                    $('[data-block-not-found-orders]').append(item_html);
                }
            }
        }

        if (data.count < 20) {
            holder.attr('data-all-items-loaded', true);
            if (append_available_order_list) {
                $('[data-last-order]').show();
            }
        } else {
            holder.attr('data-all-items-loaded', false);
        }
        showFormatListOrders();
        select2CustomSingle();
        select2CustomMulti();
        select2CustomMultiPresetItems();
        append_available_order_list = false;
    }, request_data);

}



function setFilterValuesString(objectForm, name_field, params) {
    params.delete(name_field);
    var field_name_clear = name_field;
    field_name_clear = field_name_clear.replace(/\[/g, '');
    field_name_clear = field_name_clear.replace(/\]/g, '');
    params.delete('search_history[' + field_name_clear + '][]');
    var array_choosen_values = objectForm.find('[name="' + name_field + '"]').val();
    $('[data-filter-set-item-field="'+name_field+'"]').remove();
    $('[data-filter-set-item-field="'+field_name_clear+'"]').remove();
    if (Array.isArray(array_choosen_values)) {        
        $.each(array_choosen_values, function (index, value) {
            if (value != 0) {
                var text_string = objectForm.find('[name="' + name_field + '"] option[value="' + value + '"]:first').text();
                if (value == 'any')
                {
                    return false;
                }
                if ($("[data-filter-set-text]:contains('" + $.trim(text_string) + "')").length <= 0) {
                    if ($('[data-filter-set-block]').find('[data-clear-filter]').length <= 0) {
                        var new_item = $("[data-filter-set-item-template]").clone().appendTo("[data-filter-set-block]");
                    } else {
                        var new_item = $("[data-filter-set-item-template]").clone().insertBefore("[data-clear-filter]");
                    }
                    new_item.find('[data-filter-set-text]').text($.trim(text_string));
                    new_item.removeAttr('data-filter-set-item-template');
                    new_item.attr('data-filter-set-item', true);
                    new_item.attr('data-filter-set-item-field', field_name_clear);
                    new_item.show();
                    $("[data-filter-set-block]").show();
                }
                params.append(name_field, value);
            }
        });
    } else if (objectForm.find('[name="' + name_field + '"]').attr('type') == 'checkbox') {
        if (objectForm.find('[name="' + name_field + '"]').prop('checked')) {
            var text_string = objectForm.find('[name="' + name_field + '"]').data('name');
            if (objectForm.find('[name="' + name_field + '"]').val() == 'any')
            {
                return false;
            }
            if ($("[data-filter-set-text]:contains('" + $.trim(text_string) + "')").length <= 0) {
                if ($('[data-filter-set-block]').find('[data-clear-filter]').length <= 0) {
                    var new_item = $("[data-filter-set-item-template]").clone().appendTo("[data-filter-set-block]");
                } else {
                    var new_item = $("[data-filter-set-item-template]").clone().insertBefore("[data-clear-filter]");
                }
                new_item.find('[data-filter-set-text]').text($.trim(text_string));
                new_item.removeAttr('data-filter-set-item-template');
                new_item.attr('data-filter-set-item', true);
                new_item.attr('data-filter-set-item-field', field_name_clear);
                new_item.show();
                $("[data-filter-set-block]").show();
            }
            params.append(name_field, objectForm.find('[name="' + name_field + '"]').val());
        }
    } else {
        var text_string = objectForm.find('[name="' + name_field + '"]').val();
        //if ($("[data-filter-set-text]:contains('" + $.trim(text_string) + "')").length <= 0) {        
        if ($.trim(text_string) != '') {        
            if ($('[data-filter-set-block]').find('[data-clear-filter]').length <= 0) {
                var new_item = $("[data-filter-set-item-template]").clone().appendTo("[data-filter-set-block]");
            } else {
                var new_item = $("[data-filter-set-item-template]").clone().insertBefore("[data-clear-filter]");
            }
            new_item.find('[data-filter-set-text]').text($.trim(text_string));
            new_item.removeAttr('data-filter-set-item-template');
            new_item.attr('data-filter-set-item', true);
            new_item.attr('data-filter-set-item-field', field_name_clear);
            new_item.show();
            $("[data-filter-set-block]").show();
            params.append(name_field, text_string);
        }
        //}
        
    }
}

function setFilterValuesStringFromTo(objectForm, name_field_from, name_field_to, name_in_history, params) {
    var field_name_from_clear = name_field_from;
    field_name_from_clear = field_name_from_clear.replace(/\[/g, '');
    field_name_from_clear = field_name_from_clear.replace(/\]/g, '');
    params.delete('search_history[' + field_name_from_clear + '][]');

    var field_name_to_clear = name_field_to;
    field_name_to_clear = field_name_to_clear.replace(/\[/g, '');
    field_name_to_clear = field_name_to_clear.replace(/\]/g, '');
    params.delete('search_history[' + field_name_to_clear + '][]');

    params.delete('search_history[' + field_name_from_clear + '_' + field_name_to_clear + '][]');

    var value_from = objectForm.find('[name="' + name_field_from + '"]').val();
    var value_to = objectForm.find('[name="' + name_field_to + '"]').val();
    $('[data-filter-set-item-field="'+name_field_from + '_' + name_field_to+'"]').remove();
    //if (value_to != '' && value_to > 0) {
    if(!((value_from == 0 || value_from == 1 || value_from == '') && (value_to == 0 || value_to == ''))){
        params.delete(name_field_from);
        params.delete(name_field_to);
        
        if((value_from == 1 || value_from == '')){
            value_from = 1;
        }

        if((value_to == 0 || value_to == '')){
            value_to = 'max'; 
        }        
        
        
        if($.trim(value_from) == ''){            
            value_from = objectForm.find('[name="' + name_field_from + '"]').data('minValue') ? objectForm.find('[name="' + name_field_from + '"]').data('minValue') : 0;
        }
        if(name_in_history == 'pages' && value_to == 1){
            name_in_history = 'page';
        }
        var text_string = $.trim(value_from + ' - ' + value_to + ' ' + name_in_history);
        //if ($("[data-filter-set-text]:contains('" + text_string + "')").length <= 0) {        
            if ($('[data-filter-set-block]').find('[data-clear-filter]').length <= 0) {
                var new_item = $("[data-filter-set-item-template]").clone().appendTo("[data-filter-set-block]");
            } else {
                var new_item = $("[data-filter-set-item-template]").clone().insertBefore("[data-clear-filter]");
            }
            new_item.find('[data-filter-set-text]').text(text_string);
            new_item.removeAttr('data-filter-set-item-template');
            new_item.attr('data-filter-set-item', true);
            new_item.attr('data-filter-set-item-field', name_field_from + '_' + name_field_to);
            new_item.show();
            $("[data-filter-set-block]").show();
        //}
        if(value_from != 1){
            params.append(name_field_from, value_from);    
        }
        
        if(value_to !='max'){
            params.append(name_field_to, value_to);    
        }  
    }
}

$(document).on("submit", "#form-available-orders", function () {
    availableOrdersList();
    return false;
});

$(document).on("keyup", "#form-available-orders [name='query_string']", function (event) {
    if (event.keyCode === 13) {
        $("[data-button-submit-form-available-filter]").click();
    }
});

$(document).on("click", "[data-button-submit-form-available-filter]", function () {
    use_filter_form = true;

    $('#form-available-orders').trigger('submit');
    var url_current = new URL(document.location.href);
    var params = new URLSearchParams(url_current.search.slice(1));
    
    setFilterValuesString($('#form-available-orders'), 'query_string', params);
    setFilterValuesString($('#form-available-orders'), 'type_of_work[]', params);
    setFilterValuesString($('#form-available-orders'), 'type_of_paper[]', params);
    setFilterValuesString($('#form-available-orders'), 'subject[]', params);
    setFilterValuesString($('#form-available-orders'), 'deadline[]', params);
    setFilterValuesString($('#form-available-orders'), 'academic_level[]', params);
    setFilterValuesString($('#form-available-orders'), 'preferences[]', params);
    setFilterValuesString($('#form-available-orders'), 'applied', params);
    setFilterValuesString($('#form-available-orders'), 'viewed_by_writer', params);
    setFilterValuesString($('#form-available-orders'), 'starred_orders', params);
    setFilterValuesString($('#form-available-orders'), 'auto_take', params);
    setFilterValuesStringFromTo($('#form-available-orders'), 'pages_from', 'pages_to', 'pages', params);

    $("[data-filter-set-block] div[data-filter-set-item]").each(function (index) {
        var field_name_clear = $(this).data('filterSetItemField');
        field_name_clear = field_name_clear.replace(/\[/g, '');
        field_name_clear = field_name_clear.replace(/\]/g, '');
        if ($.trim($(this).find('[data-filter-set-text]').text()) != '') {
            params.append('search_history[' + field_name_clear + '][]', $.trim($(this).find('[data-filter-set-text]').text()));
        }
    });
    if ($('[data-filter-set-block]').find('[data-filter-set-item]').length < 1) {
        $('[data-filter-set-block]').hide();
    }
    if (params.toString()) {
        window.history.pushState("object or string", "Page Title", url_current.pathname + '?' + params);
    } else {
        window.history.pushState("object or string", "Page Title", url_current.pathname);
    }
    
    if (getWindowWidth <= 767){
        $('.orders-wrapper').removeClass('orders-filters-open');
        $(this).parents('.main-filter-area').removeClass('main-filter-area-mob');
        $(this).parents('.main-filter-area').find('.filters-inner').slideUp(300);       
    }
});

$(document).on("change", "[data-select-sort-available-orders]", function () {
    availableOrdersList();
    var url_current = new URL(document.location.href);
    var params = new URLSearchParams(url_current.search.slice(1));
    params.delete('sort');
    params.delete('sort_dir');
    var sort_field = $('[data-select-sort-available-orders]').find('option:selected').data('sortField');
    var sort_direction = $('[data-select-sort-available-orders]').find('option:selected').data('sortDirection');
    if ($.trim(sort_field) != '') {
        params.set('sort', sort_field);
        params.set('sort_dir', sort_direction);
    }
    if (params.toString()) {
        window.history.pushState("object or string", "Page Title", url_current.pathname + '?' + params);
    } else {
        window.history.pushState("object or string", "Page Title", url_current.pathname);
    }
});

$(document).on("click", "[data-star-order]", function () {
    var button = $(this);
    if (button.hasClass('disabled') || button.hasClass('star-order-btn-stared'))
        return false;
    button.addClass('disabled');
    button.tooltip('hide');
    button.attr("data-original-title", "Use filter Starred orders to see the list of your pinned orders");
    var order_id = $(this).data('starOrder');
    callAjax("json", "/orders_available?ajax=setStarOrder", function (data) {
        button.removeClass('disabled');
        button.addClass('star-order-btn-stared');        
        if(button.data('contentStar')){            
            button.text(button.data('contentStarred'));
            button.attr('data-toggle','');
            setTimeout(function () {;
                $(button.attr('data-target')).modal('hide');
            }, 2000);
        }else{
            button.find('[data-content-star]').text(button.find('[data-content-starred]').data('contentStarred'));              
        }
    }, {order_id: order_id})
    return false;
});

$(document).on("click", ".star-order-btn-stared[data-star-order]", function () {
    var button = $(this);
    if (button.hasClass('disabled') || !button.hasClass('star-order-btn-stared'))
        return false;
    button.addClass('disabled');
    button.tooltip('hide');
    button.attr("data-original-title", "Pin orders you like to filter them separately");
    var order_id = $(this).data('starOrder');
    callAjax("json", "/orders_available?ajax=deleteStarOrder", function (data) {
        button.removeClass('disabled');
        button.removeClass('star-order-btn-stared');        
        if(button.data('contentStar')){
             button.text(button.data('contentStar'));     
             button.attr('data-toggle','modal');
        }else{
            button.find('[data-content-star]').text(button.find('[data-content-star]').data('contentStar'));                 
        }
        
    }, {order_id: order_id})
    return false;
});

function savedSearches(){       
    if(!$('#form-available-orders').data('initParams')){
        $('#form-available-orders').data( "initParams", Base64.encode($('#form-available-orders').serialize()) );
        
    }
    callAjax('json', '/available_orders?ajax=getSavedSearches', function (data) {
        if(data && data.saved_searches){
            $('[data-block-saved-searches]').show();
            $('[data-block-saved-searches]').addClass('d-flex');
            var holder = $('[data-block-saved-searches]').find('[data-list-saved-searches]');
            var tpl = new jSmart($('#saved_searches_list_item_template').html());
            holder.empty();
            var count_saved_searches = 0; 
            for (i in data.saved_searches) {
                var key_name = "search";
                var template_values = {};
                template_values[key_name] = data.saved_searches[i];
                template_values.current_user = CURRENT_USER;
                item_html = tpl.fetch(template_values);
                holder.append(item_html);
                count_saved_searches++;
            }    
            if(count_saved_searches >= data.max_saved_searches){
                $('[data-button-save-search]').addClass('btn-save-dissabled');
                $('[data-button-save-search]').attr('data-target','#ModalEnoughSavedFilter');
            }else{
                $('#form-available-orders').data("choosenSavedSearchParams", Base64.encode($('#form-available-orders').serialize()));
                searchButtonEnableDisable();                
            }
        }else{
            $('[data-block-saved-searches]').hide();
            $('[data-block-saved-searches]').removeClass('d-flex');
        }
    });        
}

$(document).on("click, change.select2, change, keyup", "#form-available-orders input, #form-available-orders select", function () {
    searchButtonEnableDisable();  
});


validationFormByConfig($("#saved_search_form"), function ($form, $input) {
    if ($form.validate().checkForm()) {
        $form.find('[data-submit-modal]').removeClass('submit_btn-disabled');
    } else {
        $form.find('[data-submit-modal]').addClass('submit_btn-disabled');
    }
}, function ($form, $input) {
    if ($form.validate().checkForm()) {
        $form.find('[data-submit-modal]').removeClass('submit_btn-disabled');
    } else {
        $form.find('[data-submit-modal]').addClass('submit_btn-disabled');
    }
});

$('[data-saved-search-form]').submit(function(event){
    event.preventDefault();
    event.stopPropagation();
    var form = $(this);

    if (!form.valid()) {
        return false;
    }
    form.find('input[name="search_name"]').removeClass('error');
    form.find('data-custom-error-saved-search').remove();
    form.find('[data-submit-modal]').find('.sk-fading-circle').show();
    callAjax('json', '/available_orders?ajax=saveSearch', function (data) {
        form.find('[data-submit-modal]').find('.sk-fading-circle').hide();
        if (typeof (data.result.saved_searches_add_result) === "boolean" && data.result.saved_searches_add_result === false) {
            form.find('input[name="search_name"]').addClass('error');
            form.find('input[name="search_name"]').after('<div class="alert-required" data-custom-error-saved-search="">Search with this name already exists. Try another one.</div>');
        }else{            
            var modal = form.closest('.modal');
            modal.modal('hide');
            savedSearches();
        }
    }, form.serialize() + '&' + $('#form-available-orders').serialize(), form);
    return false;
});

function searchButtonEnableDisable(){
    if($('[data-button-save-search]').attr('data-target') != '#ModalEnoughSavedFilter'){
        if(Base64.encode($('#form-available-orders').serialize()) == $('#form-available-orders').data('initParams') || 
            Base64.encode($('#form-available-orders').serialize()) == $('#form-available-orders').data('choosenSavedSearchParams')){
            $('[data-button-save-search]').addClass('btn-save-dissabled');
            $('[data-button-save-search]').attr('data-target','');    
        }else{
            $('[data-button-save-search]').removeClass('btn-save-dissabled');
            $('[data-button-save-search]').attr('data-target','#ModalSaveFilter');    
        }   
    }
}

$(document).on("click", "[data-search-content]", function () {     
    var data = Base64.decode($(this).data('searchContent'));
    var isValidJSON = data ? true : false;
    try {
        JSON.parse(data)
    } catch (e) {
        isValidJSON = false
    }
    if (isValidJSON) {
        var result = JSON.parse(data);
        var form_search = $('#form-available-orders');
        form_search.find('[type="checkbox"]').prop("checked", false);
        for (variable in result) {
            if(Array.isArray(result[variable])){
                form_search.find('[name="'+variable+'[]"]').each(function() { $(this).val([]); });
                for (let one_option of result[variable]) {
                    form_search.find('[name="'+variable+'[]"]').find("option[value='"+one_option+"']").prop("selected", "selected");
                }
                form_search.find('[name="'+variable+'[]"]').trigger('change.select2');
                select2CustomMultiPresetItems();
            }else{
                var input_object = form_search.find('[name="'+variable+'"]');
                if(input_object.attr('type') == 'checkbox'){
                    form_search.find('[name="'+variable+'"]').prop("checked", "checked");
                }else{
                    form_search.find('[name="'+variable+'"]').val(result[variable]);
                }                
            }
            form_search.find('[name="'+variable+'"]').trigger('change');
        }        
        $('.dropdown-pages').trigger('click');
        $('#form-available-orders').data("choosenSavedSearchParams", Base64.encode($('#form-available-orders').serialize()));  
        searchButtonEnableDisable();
    }
});

$(document).on("click", "[data-delete-search]", function () {     
    var name_search = $(this).data('nameSearch');
    $('[data-delete-search-form]').find('[data-name-delete-saved-search]').text(name_search);
    $('[data-delete-search-form]').find('input[name="saved_search_id"]').val($(this).data('searchId'));
});

$('[data-delete-search-form]').submit(function(event){
    event.preventDefault();
    event.stopPropagation();
    var form = $(this);
    form.find('[data-submit-modal]').find('.sk-fading-circle').show();
    callAjax('json', '/available_orders?ajax=deleteSavedSearch', function (data) {
        form.find('[data-submit-modal]').find('.sk-fading-circle').hide();
        var modal = form.closest('.modal');
        modal.modal('hide');
        $('[data-button-save-search]').attr('data-target','#ModalSaveFilter');
        savedSearches();
    }, form.serialize(), form);
    return false;
});


/*Available orders js END*/
//INVITATIONS

var invitations_limit_from;
function InvitationsList() {
    invitations_limit = 20;  
    
    if(is_loading){
        return false;
    }          
    is_loading = true;

    if ($("[data-is-invitations-loaded]").attr('data-is-invitations-loaded') === 'false') {
        $("[data-block-items-invitations]").html(loader);
    } else {
        $("[data-block-items-invitations]").append(loader);
    }
    
    if(typeof CURRENT_USER === 'undefined'){
        CURRENT_USER = {};
    }
        
    callAjax('json', '/invitations?ajax=GetInvites', function (data) {
        $("[data-is-invitations-loaded]").attr('data-is-invitations-loaded','true');
        $("[data-block-items-invitations]").find('[data-loader-html]').remove();
        if (data.count > 0) {
            $("[data-counter-invitations]").html(data.count + ' found');            
            $("[data-counter-invitations]").attr('data-counter-invitations',data.count);            
            var tpl = new jSmart($('#invitations_list_item_template').html());
            var i = 0;
            for (i in data.invites) {                              
                var template_values = {};
                template_values['invite'] = data.invites[i];
                template_values.current_user = CURRENT_USER;                             
                $("[data-block-items-invitations]").append(tpl.fetch(template_values));
            }
            invitations_limit_from = invitations_limit + (typeof invitations_limit_from === 'undefined' ? 0 : invitations_limit_from);
            if (invitations_limit_from > data.count) {
                $('.order-main-wrap').find('.list-content').attr('data-all-invitations-loaded', 'true');
                var tpl = new jSmart($('#invitations_thats_all_template').html());
                $("[data-block-items-invitations]").append(tpl.fetch());
                $('#content-wrapper').unbind('scroll');
            }
            invitationsSetShowed();            
        } else {
            $('.order-main-wrap').find('.list-content').attr('data-all-invitations-loaded', 'true');
            $('#content-wrapper').unbind('scroll');            
            $("[data-counter-invitations]").html('0 found');
            $("[data-counter-invitations]").attr('data-counter-invitations',0);
            $("[data-block-items-invitations]").hide();
            var tpl_0_found = new jSmart($('#invitations_not_found_template').html());           
            $("[data-block-inner-invitations]").append(tpl_0_found.fetch());
        }
        is_loading = false;
    }, {
        filter_by_order_status: true,
        limit: invitations_limit,
        limit_from: (typeof invitations_limit_from === 'undefined' ? 0 : invitations_limit_from)
    });
}

function InvitationsListByScroll() {
    $('#content-wrapper').scroll(function () {        
        if ($('.order-main-wrap').find('.list-content').attr('data-all-invitations-loaded') === 'false') {
            if ($("#content-wrapper .list-content")[0].scrollHeight > 0 &&
                    $("#content-wrapper").scrollTop() > ($("#content-wrapper .list-content")[0].scrollHeight - $("#content-wrapper")[0].offsetHeight + 420)
                    ) {
                    InvitationsList();
            }
        }
    });
}

function cleanInvitationPage() {
    invitations_limit_from = null;
    $("[data-is-invitations-loaded]").attr('data-is-invitations-loaded', 'false');
    $('.order-main-wrap').find('.list-content').attr('data-all-invitations-loaded', 'false');
}

function invitationsSetShowed() {
    callAjax('json', '/invitations?ajax=setShowed', function (data) {
        if (typeof data.result !== 'undefined' && data.result === 'ok') {
            $('[data-ajax-load-page="/invitations"] .counter').html(0).hide();           
        }
    });
}

$(document).on('click', '[data-skip-invitation]', function () {
    var $button = $(this);
    $button.find('.sk-fading-circle').show();
    callAjax('json', '/invitations?ajax=Remove', function (data) {
        $button.find('.sk-fading-circle').hide();
        if (typeof data.result !== 'undefined' && data.result === 'ok') {
            if ($button.attr('data-order-detailed')) {                
                //$("[data-main-content]").html($('[data-loader]').html());
                redirect('/invitations');
            } else {
                $button.closest('.invitation-block-item').hide().remove();
                var count = $("[data-counter-invitations]").attr('data-counter-invitations');
                $("[data-counter-invitations]").html(parseInt(count - 1) + ' found');
                $("[data-counter-invitations]").attr('data-counter-invitations', count - 1);
            }

        }
    }, {id: $button.attr('data-skip-invitation')});
});


//END INVITATIONS
//------ORDERS DETAILS PAGE
$(document).on("click", ".see-more-instructions", function (e) {    
    $(this).toggleClass('see-less-instructions');
    $(this).parent().find('.option-instructions-inner').toggleClass('option-instructions-less');
});

showButtonSeeMore();

function showButtonSeeMore(){
    if($('div[data-block-paper_details]').length > 0){
        var line_height_type_of_paper = $('div[data-block-paper_details]').css('line-height');
        var height_type_of_paper = $('div[data-block-paper_details]').css('height');
        var line_height_type_of_paper = line_height_type_of_paper.replace(/\D/g, "");
        var height_type_of_paper = height_type_of_paper.replace(/\D/g, "");
        if((height_type_of_paper/line_height_type_of_paper) > 13){
            $('[data-show-more-paper-details]').show();
        }
    }
    
}

function detailsPaperUploadChecklist(){
    if(ORDER){
        $('[data-block-paper-fromat-info]').hide();
        $('[data-block-page-info]').hide();        
        if(ORDER.paper_format_name){
            $('[data-block-paper-format-info]').show();    
            $('[data-paper-format-info-modal]').html(ORDER.paper_format_name); 
        }
        if(ORDER.pages && ORDER.pages>0 && ORDER.spacing){
            $('[data-block-page-info]').show();    
            $('[data-pages-info-modal]').html(ORDER.pages); 
            if(ORDER.spacing == 2){
                $('[data-words-info-modal]').html(ORDER.pages*275);     
            }else{
                $('[data-words-info-modal]').html(ORDER.pages*550); 
            }            
        }
    }    
}


/**
 * @returns void
 */
function initOrderDetailed() {
    
    $('body').on('click', ".writers-list-inner .tab-link", function () {
        var changeParamInUrl = function(param,paramValue){
            var newQuery = '';
            $.each(parseQuery(window.location.search),function(key,value){      
                if(key === param){
                    if(paramValue !== null){
                      newQuery += '&' + key + '=' + paramValue;                                       
                    }
                } else{
                    newQuery += '&' + key + '=' + value;
                }
            });
            return window.location.origin + window.location.pathname + '?' + newQuery.substring(1);
        };
        
        var url = window.location.href + '&tab=' + $(this).attr('data-location-href');
        
        if ($(this).attr('data-location-href') === 'details') {
            url = changeParamInUrl('tab', null);
        } else if (getParameterByName('tab')) {
            url = changeParamInUrl( 'tab', $(this).attr('data-location-href'));
        } 
        
        history.replaceState(
            null,
            document.title,
            url
        );
        
    });
    
    //available_orders

    detailsPaperUploadChecklist();
    initMessagesTabHolders();
    addCyrillicValidationMethod();
    setApplySubmitEvent("[data-apply-form][data-content-form]");

    $('[data-apply-order-btn]').click(function () {
        if ($('[data-tab-item-details]').hasClass('current')) {
            $('#content-wrapper').animate({
                scrollTop: $(".order-details-apply").offset().top - 100
            }, 500);
        } else {
            $('#ModalApplyCase').modal('show');
        }
    });
    
    $('#ModalApplyCase').on('show.bs.modal', function() {
        if(typeof ORDER === 'object' && typeof CURRENT_USER === 'object') {
                $("#ModalApplyCase").find("[name='order']").val(ORDER.id);
                $("#ModalApplyCase").find(".apply-price-currency").text(CURRENT_USER.currency_sign);
                $("#ModalApplyCase").find("[name='bid']").val(ORDER.price);
                $("#ModalApplyCase").find("[name='bid']").attr('data-bid-value', ORDER.price);
                $("#ModalApplyCase").find(".lowest-bid-price").text(CURRENT_USER.currency_sign + ORDER.lowest_bid);
        }
    })
    
    $('#ModalApplyCase').on('hidden.bs.modal', function() {
            $("#ModalApplyCase").find("[name='order']").val();
            $("#ModalApplyCase").find(".apply-price-currency").text();
            $("#ModalApplyCase").find("[name='bid']").val();
            $("#ModalApplyCase").find("[name='bid']").attr('data-bid-value', '');
            $("#ModalApplyCase").find(".lowest-bid-price").text(CURRENT_USER.currency_sign);
    })

    //solution for active tab
    
    setTimeout(function () {
        //var currentTabUrl = getParameterByName('tab');
        //var currentTabCookie = getCookie('activeTabsData_' + getParameterByName('id'));
        //if (currentTabUrl) {
        //    setCookie('activeTabsData_' + getParameterByName('id'), currentTabUrl, 1 * 24 * 3600);
        //    $(".order-detailed-page .writers-list-inner .tabs .tab-link.current").click();
        //} else if (currentTabCookie) {
        //    $("[data-location-href='" + currentTabCookie + "'].tab-link").click();
        //} else {
        //    $(".order-detailed-page .writers-list-inner .tabs .tab-link.current").click();
        //}
        $(".order-detailed-page .writers-list-inner .tabs .tab-link.current").click();
    }, 100);
    
    $('body').on('click', ".writers-list-inner .tab-link", function () {
        setCookie('activeTabsData_' + getParameterByName('id'), $(this).attr('data-location-href'), 1 * 24 * 3600);
    }); 

    validationFormByConfig($("#apply_form"), function ($form, $input) {
        if ($form.validate().checkForm()) {
            $form.find('[data-apply-case-btn]').removeClass('submit_btn-disabled');
        } else {
            $form.find('[data-apply-case-btn]').addClass('submit_btn-disabled');
        }
    }, function ($form, $input) {
        if ($form.validate().checkForm()) {
            $form.find('[data-apply-case-btn]').removeClass('submit_btn-disabled');
        } else {
            $form.find('[data-apply-case-btn]').addClass('submit_btn-disabled');
        }
    });

    /*set dymamicly*/
    $("[data-modal-order-id]").click(function () {
        var modal = $("" + $(this).attr('data-target') + "");
        modal.find("[name='order_id']").val($(this).attr('data-modal-order-id'));
    });

    $("[data-apply-form] [name='bid']").on("focusout", function () {
        var val = $(this).val();
        if (val.length) {
            var last_char = val.substr(val.length - 1);
            if (last_char == '.' || last_char == ',') {
                val = val + '0';
                $(this).val(val);
            }
        }
    });

    $("[data-apply-form] [name='bid']").on("input change", function () {
        var val = $(this).val().match(/([0-9]{1}[0-9\.,]*)/g);
        if (!val) {
            $(this).val('');
            return false;
        }
        val = val.join('');

        var result = '';
        var is_has_point = false;
        var numbers_length = 0;

        for (var i = 0; i < val.length; i++) {
            var _val = val.charAt(i);
            if (_val == '.' || _val == ',') {
                if (!is_has_point) {
                    result += _val;
                    is_has_point = true;
                }
            } else {
                if (is_has_point && numbers_length >= 2) {
                    break;
                } else {
                    result += _val;
                    if (is_has_point) {
                        numbers_length++;
                    }
                }
            }
        }

        var val = $(this).val(result);
        return false;
    });

    $("[data-show-top-info]").click(function () {
        var modal = $("#ModalTYPtooltip");
        var button = $(this);
        callAjax("html", "/orders_available?subcom=GetTypeOfPaperInfo", function (data) {
            var isValidJSON = data ? true : false;
            try {
                JSON.parse(data)
            } catch (e) {
                isValidJSON = false
            }
            if (isValidJSON) {
                var result = JSON.parse(data);
                if (result.html) {
                    modal.find('.modal-title').html(button.attr("data-show-top-info"));
                    modal.find('.modal-body').html(result.html);
                    modal.modal('show');
                }
            }

        }, {name: button.attr("data-show-top-info"), ajax_load_page: true});        
    });

    var submitted_copy_text = false;
    $("[data-copy-text]").click(function () {
        var text_topic = $('[data-block-topic]').text();
        var text = $('[data-block-paper_details]').text();
        if (typeof text !== 'undefined' && typeof text_topic !== 'undefined') {
            var textArea = document.createElement("textarea");
            textArea.value = (text_topic + text);
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                if (document.execCommand('copy')) {
                    var button = $(this);
                    button.addClass('btn-copied-success').html(button.attr('data-text-success'));
                    setTimeout(function () {
                        button.removeClass('btn-copied-success').html(button.attr('data-text-base'));
                    }, 3000);

                    if (!submitted_copy_text) {
                        submitted_copy_text = true;
                        callAjax('json', '/my_orders?ajax=descriptionCopied', function (data) {
                            submitted_copy_text = false;
                        }, {order_id: button.attr("data-order-id")});
                    }
                }
            } catch (err) {
                
            }

            document.body.removeChild(textArea);
        }
    });

    //my_orders
    
    $("[data-confirm-order]").click(function () {
        var button = $(this);
        button.find('.sk-fading-circle').show();
        callAjax('json', '/my_orders?ajax=markConfirm', function (data) {
            button.find('.sk-fading-circle').hide();
            redirect('/my_orders?subcom=detailed&id=' + button.attr('data-order-id'));
        }, {order: button.attr('data-order-id')});
    });

    $("[data-extend-deadline]").click(function () {
        var modal = $("#ModalExtendDeadline");
        if ($(this).attr('data-new-form-extend-dealine') === '1') {
            modal.find('input[name="type_form_deadline"]').val(1);
            modal.find('.base-extend-deadline-content').hide();
            modal.find('.textarea-label-bold').hide();
            modal.find('.plus-minus-group').addClass('plus-minus-notextarea');
            modal.find('.new-extend-deadline-content').show();
        }
        else if($(this).attr('data-new-form-extend-dealine') === '2'){
             var modal = $("#ModalExtendDeadlineFalse");
        }
        else {
            modal.find('input[name="type_form_deadline"]').val(0);
            modal.find('.base-extend-deadline-content').show();
            modal.find('.textarea-label-bold').show();
            modal.find('.plus-minus-group').removeClass('plus-minus-notextarea');
            modal.find('.new-extend-deadline-content').hide();
        }
        if($(this).attr('data-new-form-extend-dealine') != '2'){
            modal.find('input[name="order_id"]').val($(this).attr('data-order-id'));
        }
        modal.modal('show');
    });

}

validationFormByConfig($("#apply_form_modal"),
        function ($form, $input) {
            if ($form.validate().checkForm()) {
                $form.find('[data-apply-case-btn]').removeClass('submit_btn-disabled');
            } else {
                $form.find('[data-apply-case-btn]').addClass('submit_btn-disabled');
            }
        },
        function ($form, $input) {
            if ($form.validate().checkForm()) {
                $form.find('[data-apply-case-btn]').removeClass('submit_btn-disabled');
            } else {
                $form.find('[data-apply-case-btn]').addClass('submit_btn-disabled');
            }
        },
        'apply_form');

validationFormByConfig($("#information_request_form"), function ($form, $input) {
    if ($form.validate().checkForm()) {
        $form.find('[data-submit-modal]').removeClass('submit_btn-disabled');
    } else {
        $form.find('[data-submit-modal]').addClass('submit_btn-disabled');
    }
}, function ($form, $input) {
    if ($form.validate().checkForm()) {
        $form.find('[data-submit-modal]').removeClass('submit_btn-disabled');
    } else {
        $form.find('[data-submit-modal]').addClass('submit_btn-disabled');
    }
});

validationFormByConfig($("#remove_apply_form"), function ($form, $input) {
    if ($form.validate().checkForm()) {
        $form.find('[data-submit-modal]').removeClass('submit_btn-disabled');
    } else {
        $form.find('[data-submit-modal]').addClass('submit_btn-disabled');
    }
}, function ($form, $input) {
    if ($form.validate().checkForm()) {
        $form.find('[data-submit-modal]').removeClass('submit_btn-disabled');
    } else {
        $form.find('[data-submit-modal]').addClass('submit_btn-disabled');
    }
});

validationFormByConfig($("#reassign_form"), function ($form, $input) {
    if ($form.validate().checkForm()) {
        $form.find('[data-submit-modal]').removeClass('submit_btn-disabled');
    } else {
        $form.find('[data-submit-modal]').addClass('submit_btn-disabled');
    }
}, function ($form, $input) {
    if ($form.validate().checkForm()) {
        $form.find('[data-submit-modal]').removeClass('submit_btn-disabled');
    } else {
        $form.find('[data-submit-modal]').addClass('submit_btn-disabled');
    }
});

validationFormByConfig($("#extend_deadline_form"), function ($form, $input) {
    var is_valid_deadline = !($("[data-form-extend-deadline] [name='minutes']").val() == 0
            && $("[data-form-extend-deadline] [name='hours']").val() == 0);
    if ($form.validate().checkForm() && is_valid_deadline) {
        $form.find('[data-submit-modal]').removeClass('submit_btn-disabled');
    } else {
        $form.find('[data-submit-modal]').addClass('submit_btn-disabled');
    }
}, function ($form, $input) {
    var is_valid_deadline = !($("[data-form-extend-deadline] [name='minutes']").val() == 0
            && $("[data-form-extend-deadline] [name='hours']").val() == 0);
    if ($form.validate().checkForm() && is_valid_deadline) {
        $form.find('[data-submit-modal]').removeClass('submit_btn-disabled');
    } else {
        $form.find('[data-submit-modal]').addClass('submit_btn-disabled');
    }
});


validationFormByConfig($("#clarification_needed_form"), function ($form, $input) {
    if ($form.validate().checkForm()) {
        $form.find('[data-submit-modal]').removeClass('submit_btn-disabled');
    } else {
        $form.find('[data-submit-modal]').addClass('submit_btn-disabled');
    }
}, function ($form, $input) {
    if ($form.validate().checkForm()) {
        $form.find('[data-submit-modal]').removeClass('submit_btn-disabled');
    } else {
        $form.find('[data-submit-modal]').addClass('submit_btn-disabled');
    }
});

validationFormByConfig($("#remove_from_clarification_form"), function ($form, $input) {
    if ($form.validate().checkForm()) {
        $form.find('[data-submit-modal]').removeClass('submit_btn-disabled');
    } else {
        $form.find('[data-submit-modal]').addClass('submit_btn-disabled');
    }
}, function ($form, $input) {
    if ($form.validate().checkForm()) {
        $form.find('[data-submit-modal]').removeClass('submit_btn-disabled');
    } else {
        $form.find('[data-submit-modal]').addClass('submit_btn-disabled');
    }
});

$("[data-information-request-form]").submit(function () {
    event.preventDefault();
    event.stopPropagation();
    var $form = $(this);

    if (!$form.valid()) {
        return false;
    }

    $form.find('[data-submit-modal]').find('.sk-fading-circle').show();
    callAjax('json', '/messages?ajax=create', function (data) {
        $form.find('[data-submit-modal]').find('.sk-fading-circle').hide();
        var $modal = $form.closest('.modal');
        if (typeof (data.message_created) === "boolean" && data.message_created === true) {
            $modal.find('.request-block').hide();
            $modal.addClass('modal-popup').removeClass('modal-custom');
            $modal.find('.success-block').show();
            $modal.attr('data-submited', '1');
            setTimeout(function () {
                if ($modal.attr('data-submited') === '1') {
                    $modal.modal('hide');
                }
            }, 2000);
            $modal.on('hidden.bs.modal', function () {
                $modal.addClass('modal-custom').removeClass('modal-popup');
                $modal.attr('data-submited', null);
                $modal.find('.request-block').show();
                $modal.find('.success-block').hide();
                $form.find('input[type="text"], textarea').val('');
            });
        }
    }, $form.serialize() + '&message_text=' + Base64.encode($form.find('[name="message_text_clean"]').val()) + '&return_message_data=1', $form);
    return false;
});

/**
 * it's used in initOrderDetailed and after function's initialization setApplySubmitEvent
 * @param block's identification apply_blocks
 * @returns false
 */
function setApplySubmitEvent(apply_blocks) {
    $(apply_blocks).submit(function () {
        event.preventDefault();
        event.stopPropagation();
        var $form = $(this);

        if (!$form.valid()) {
            return false;
        }
        $form.find('[data-apply-case-btn]').find('.sk-fading-circle').show();
        
        $form.find("[name='bid']").val($form.find("[name='bid']").val().replace(',', '.'));

        callAjax("json", "/orders_available?ajax=apply", function (data) {
            $form.find('[data-apply-case-btn]').find('.sk-fading-circle').show();
            if (typeof (data.applied) === "boolean" && data.applied === true) {
                if ($form.attr('data-apply-modal')) {
                    $form.closest(".modal").modal('hide');
                    $form.find('input[type="text"], textarea').val('');
                    $form.closest(".modal").find('input[name="bid"]').val($form.closest(".modal").find('input[name="bid"]').attr('data-bid-value'));
                    $form.find('[data-apply-case-btn]').find('.sk-fading-circle').hide();
                    $("#ModalApplyCaseSuccess").modal('show');
                    setTimeout(function () {
                        $("#ModalApplyCaseSuccess").modal('hide');
                    }, 4000);
                } else {
                    $form.closest('.order-details-apply').find('.order-apply-box.apply-content-box').hide();
                    $form.closest('.order-details-apply').find('.details-apply-success').show();
                }

                var RedirectUrl = '/orders_available?subcom=detailed&id=' + $form.find("[name='order']").val();
                if (data.auto_confirmed) {
                    var RedirectUrl = '/my_orders?subcom=detailed&id=' + $form.find("[name='order_id']").val();
                }
                setTimeout(function () {
                    redirect(RedirectUrl);
                }, 2000);
            } else {
                $form.find('[data-apply-case-btn]').addClass('submit_btn-disabled');
                $form.find('[data-apply-case-btn]').find('.sk-fading-circle').hide();
            }
        }, $form.serialize(), $form);
    });

}
setApplySubmitEvent("[data-apply-form][data-apply-modal]");


$("[data-remove_apply_form]").submit(function () {
    event.preventDefault();
    event.stopPropagation();
    var $form = $(this);

    if (!$form.valid()) {
        return false;
    }

    $form.find('[data-submit-modal]').find('.sk-fading-circle').show();
    callAjax('json', '/orders_available?ajax=RemoveApply', function (data) {
        $form.find('[data-submit-modal]').find('.sk-fading-circle').hide();
        var $modal = $form.closest('.modal');
        if (data.result) {
            $modal.find('.request-block').hide();
            $modal.addClass('modal-popup').removeClass('modal-custom');
            $modal.find('.success-block').show();
            var RedirectUrl = '/orders_available?subcom=detailed&id=' + $form.find("[name='order_id']").val();
            var timeout = setTimeout(function () {
                redirect(RedirectUrl);
                $modal.modal('hide');
            }, 2000);
            $modal.on('hidden.bs.modal', function () {
                $modal.addClass('modal-custom').removeClass('modal-popup');
                $modal.find('.request-block').show();
                $modal.find('.success-block').hide();
                $modal.find('input[type="text"], textarea').val('');
            });
        }
    }, $form.serialize(), $form);
});

$("[data-form-reasign]").submit(function () {
    event.preventDefault();
    event.stopPropagation();
    var $form = $(this);

    if (!$form.valid()) {
        return false;
    }

    $form.find('[data-submit-modal]').find('.sk-fading-circle').show();

    callAjax('json', '/messages?ajax=create', function (data) {
        $form.find('[data-submit-modal]').find('.sk-fading-circle').hide();
        var $modal = $form.closest('.modal');
        if (typeof (data.message_created) === "boolean" && data.message_created === true) {
            $modal.find('.request-block').hide();
            $modal.addClass('modal-popup').removeClass('modal-custom');
            $modal.find('.success-block').show();
            var RedirectUrl = '/my_orders?subcom=detailed&id=' + $form.find("[name='order_id']").val();
            var timeout = setTimeout(function () {
                redirect(RedirectUrl);
                $modal.modal('hide');
            }, 2000);
            $modal.on('hidden.bs.modal', function () {
                $modal.addClass('modal-custom').removeClass('modal-popup');
                $modal.find('.request-block').show();
                $modal.find('.success-block').hide();
                $modal.find('input[type="text"], textarea').val('');
            });
        }
    }, $form.serialize() + '&message_text=' + Base64.encode($form.find('[name="message_text_clean"]').val()) + '&return_message_data=1', $form);
});

$("[data-clarification-needed]").submit(function () {
    event.preventDefault();
    event.stopPropagation();
    var $form = $(this);

    if (!$form.valid()) {
        return false;
    }

    $form.find('[data-submit-modal]').find('.sk-fading-circle').show();

    callAjax('json', '/messages?ajax=create', function (data) {
        $form.find('[data-submit-modal]').find('.sk-fading-circle').hide();
        var $modal = $form.closest('.modal');
        if (typeof (data.message_created) === "boolean" && data.message_created === true) {
            $modal.find('.request-block').hide();
            $modal.addClass('modal-popup').removeClass('modal-custom');
            $modal.find('.success-block').show();
            var RedirectUrl = '/my_orders?subcom=detailed&id=' + $form.find("[name='order_id']").val();
            var timeout = setTimeout(function () {
                redirect(RedirectUrl);
                $modal.modal('hide');
            }, 2000);
            $modal.on('hidden.bs.modal', function () {
                $modal.addClass('modal-custom').removeClass('modal-popup');
                $modal.find('.request-block').show();
                $modal.find('.success-block').hide();
                $modal.find('input[type="text"], textarea').val('');

            });
        }
    }, $form.serialize() + '&message_text=' + Base64.encode($form.find('[name="message_text_clean"]').val()) + '&return_message_data=1', $form);
});

$("[data-remove-from-clarification]").submit(function () {
    event.preventDefault();
    event.stopPropagation();
    var $form = $(this);

    if (!$form.valid()) {
        return false;
    }

    $form.find('[data-submit-modal]').find('.sk-fading-circle').show();

    callAjax('json', '/my_orders?ajax=RemoveFromClarification', function (data) {
        $form.find('[data-submit-modal]').find('.sk-fading-circle').hide();
        var $modal = $form.closest('.modal');
         console.log('modal', $modal);
        console.log('data.result', data.result);
        if (typeof (data.result) === "boolean" && data.result === true) {
            $modal.find('.request-block').hide();
            $modal.addClass('modal-popup').removeClass('modal-custom');
            $modal.find('.success-block').show();
            var RedirectUrl = '/my_orders?subcom=detailed&id=' + $form.find("[name='order_id']").val();
            var timeout = setTimeout(function () {
                redirect(RedirectUrl);
                $modal.modal('hide');
            }, 2000);
            $modal.on('hidden.bs.modal', function () {
                $modal.addClass('modal-custom').removeClass('modal-popup');
                $modal.find('.request-block').show();
                $modal.find('.success-block').hide();
                $modal.find('input[type="text"], textarea').val('');

            });
        }
    }, $form.serialize() + '&message_text=' + Base64.encode($form.find('[name="message_text_clean"]').val()), $form);
});

$("#cancel-remove-from-clarification").click(function () {
    $("#ModalRemoveFromClarification").find("textarea").val('');
});

$("[data-form-extend-deadline]").submit(function () {
    event.preventDefault();
    event.stopPropagation();
    var $form = $(this);
    if (!$form.valid()) {
        return false;
    }

    //no zero hours and minutes together
    if ($("[data-form-extend-deadline] [name='minutes']").val() == 0
            && $("[data-form-extend-deadline] [name='hours']").val() == 0) {
        $("[data-form-extend-deadline] [data-text-error-empty-zero-count]").show();
        $("[data-form-extend-deadline] [data-submit-modal]").addClass('submit_btn-disabled');
        return false;
    } else {
        $("[data-form-extend-deadline] [data-text-error-empty-zero-count]").hide();
    }

    var type_form_deadline = $form.find('input[name="type_form_deadline"]').val();
    if (type_form_deadline === '1') {
        var url = '/my_orders?ajax=newExtendDeadlineCustom';
        $('.alert-required-custom.ajax-errors').html('');
    } else {
        var url = '/my_orders?ajax=extendDeadlineCustom';
    }

    $('.alert-required-custom.ajax-errors').html('');

    $form.find('[data-submit-modal]').find('.sk-fading-circle').show();
    callAjax('json', url, function (data) {
        $form.find('[data-submit-modal]').find('.sk-fading-circle').hide();
        var $modal = $form.closest('.modal');
        if (typeof data.result !== 'undefined' && data.result === true) {
            $modal.find('.request-block').hide();
            $modal.addClass('modal-popup').removeClass('modal-custom');

            if (type_form_deadline === '1') {
                $modal.find('[data-success-extend-withtextarea]').hide();
                $modal.find('[data-success-extend-noextarea]').show();
            } else {
                $modal.find('[data-success-extend-withtextarea]').show();
                $modal.find('[data-success-extend-noextarea]').hide();
            }
            $modal.find('.success-block').show();
            var RedirectUrl = '/my_orders?subcom=detailed&id=' + $form.find("[name='order_id']").val();
            var timeout = setTimeout(function () {
                redirect(RedirectUrl);
                $modal.modal('hide');
            }, 2000);
            $modal.on('hidden.bs.modal', function () {
                $modal.addClass('modal-custom').removeClass('modal-popup');
                $modal.find('.alert-required-custom.ajax-errors').html('');
                $modal.find('input[name="minutes"]').val('0');
                $modal.find('input[name="hours"]').val('1');
                $modal.find('textarea').val('');
                $modal.find('.request-block').show();
                $modal.find('.success-block').hide();
                $modal.find('[data-success-extend-withtextarea]').hide();
                $modal.find('[data-success-extend-noextarea]').hide();
            });
        } else if (typeof data.result.c_error != 'undefined') {
            $('.alert-required-custom.ajax-errors').html(data.result.c_error);
        }
    }, $form.serialize(), $form);
});

$("[data-form-extend-deadline] [name='minutes'], [data-form-extend-deadline] [name='hours']").on("input change", function () {
    var element = $(this);

    if (element.val() == '' && element.attr('data-default-value') == '1') {
        element.val(1);
    }

    if (parseInt(element.val()) > parseInt(element.attr('data-max-value'))) {
        element.val(element.attr('data-max-value'));
    }
    var $form = element.closest('form');

    //no zero hours and minutes together
    var is_valid_deadline = !($("[data-form-extend-deadline] [name='minutes']").val() == 0
            && $("[data-form-extend-deadline] [name='hours']").val() == 0);

    if (is_valid_deadline) {
        $("[data-form-extend-deadline] [data-text-error-empty-zero-count]").hide();
    } else {
        $("[data-form-extend-deadline] [data-text-error-empty-zero-count]").show();
    }

    if ($form.validate().checkForm() && is_valid_deadline) {
        $form.find('[data-submit-modal]').removeClass('submit_btn-disabled');
    } else {
        $form.find('[data-submit-modal]').addClass('submit_btn-disabled');
    }

    $form.find('.ajax-errors').empty();
});

$('[data-success-apply]').on("click", function () {
    $(this).parents().find('.details-apply-success').fadeOut();
});
//END apply btn on order details page

//add bootsteap tooltips
$('body').tooltip({
    selector: '[data-toggle=tooltip]'
});
//END bootsteap tooltips

// order details page timer
function makeTimer() {	
    var endTime = new Date("30 September 2020 9:56:00 GMT+01:00");
    endTime = (Date.parse(endTime) / 1000);

    var now = new Date();
    now = (Date.parse(now) / 1000);

    var timeLeft = endTime - now;

    var days = Math.floor(timeLeft / 86400);
    var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
    var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600)) / 60);

    if (hours < "10") {
        hours = "0" + hours;
    }
    if (minutes < "10") {
        minutes = "0" + minutes;
    }

    $(".countdown-days").html(days);
    $(".countdown-hours").html(hours);
    $(".countdown-minutes").html(minutes);
    if (timeLeft < 0) {
//        clearInterval(deadlineInterval);
        $('.countdown-wrapper').addClass('countdown-wrapper-negative')
    }
}

/*var deadlineInterval = setInterval(function () {
    makeTimer();
}, 1000);*/
//END order details page timer

//-----END ORDERS DETAILS PAGE

// -----MODALS
$("[data-textarea-modal]").on("input", function () {
    $(this).parents('.modal').find("[data-submit-modal]").removeClass('submit_btn-disabled');
});
// ----- END MODALS

//check order details description view by tabs active

function initTabsListOrderDetails(){
    var tab = document.querySelectorAll(".order-detailed-page .tab-link");
    var details = document.querySelector(".order-title-inner");
    var tabsList = document.querySelector(".order-detailed-page .tabs-list");
    var alert = document.querySelector(".order-alerts-wrapper");
    var tabDetails = document.querySelector('[data-tab="tab-1"]');
    var navHeight = $('.navbar').height();

    tab.forEach(function(item, i, massive){       
        tab[i].addEventListener('click', function(e){
            if(this.getAttribute('data-tab') == "tab-2" || this.getAttribute('data-tab') == "tab-3"){
                details.classList.add('active');
                tabsList.classList.add('active');
                alert.classList.add('active');
                $('.details-head-row').addClass("details-head-fixed");
                $(".details-head-row").css({ // scroll to that element or below it
                    top: navHeight
                });
            }else{
                $('.details-head-row').removeClass("details-head-fixed");
                details.classList.remove('active');
                tabsList.classList.remove('active');
                alert.classList.remove('active');
            }    
        });
        if(tabDetails.classList.contains("current")){        
            details.classList.remove('active');
            tabsList.classList.remove('active');
            alert.classList.remove('active');
        }else{
            details.classList.add('active');
            tabsList.classList.add('active');
            alert.classList.add('active');
        }    
    });        
}

initTabsListOrderDetails();

//check upload files

$('body').on('click', ".checked-upload .custom-checkbox", function() {
    if($(this).hasClass('checked')){
        $(this).removeClass('checked');
        $(this).parent().closest("tr").removeClass('checked');
    }else{
        $(this).addClass('checked');
        $(this).parent().closest("tr").addClass('checked');
    }
});
 
 function initMessagesTabHolders() {
       message_tabs_scroll = {
            blocks: {
                support: $(".order-messages .tab-content-support .chat-wrapper>.messages-list-holder"),
                writer: $(".order-messages .tab-content-writer .chat-wrapper>.messages-list-holder")
            },
            top: {
                support: 0,
                writer: 0
            },
            scrolled: {
                support: false,
                writer: false
            },
            textareaBlocks: {
                support: false,
                writer: false
            },
            minHeight: 100
    }; 
    message_templates = {
        daily_block: $("#messages_daily_block").length > 0 ? new jSmart($("#messages_daily_block")[0].innerHTML) : null,
        list_item: $("#messages_item_block").length > 0 ? new jSmart($("#messages_item_block")[0].innerHTML) : null,
        file_upload_item: $("#messages_file_item").length > 0 ? new jSmart($("#messages_file_item")[0].innerHTML) : null,
        message_from_support: $("#message_from_support").length > 0 ? new jSmart($("#message_from_support")[0].innerHTML) : null,
        message_from_writer: $("#message_from_writer").length > 0 ? new jSmart($("#message_from_writer")[0].innerHTML) : null,
        typing_msg_loader: $("#typing_msg_loader").length > 0 ? new jSmart($("#typing_msg_loader")[0].innerHTML) : null,
        new_ticket_message: $("#new_ticket_message").length > 0 ? new jSmart($("#new_ticket_message")[0].innerHTML) : null
    };
      
 }
 function addCyrillicValidationMethod() {
     	$.validator.addMethod('check_cyrillic', function (value) {
     		var result = true;
		var iChars = "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
		for (var i = 0; i < value.length; i++) {
			if (iChars.indexOf(value.charAt(i)) != -1) {
				return false;
	          }
		}
		return result;
	}, '');
 }

/*Messages js START*/
// Messeges custom js
var message_tabs_scroll = {};
var form_blocks = {};
var currentTabId = 1;
var currentTabStatus = 'active';
var is_online = true;
var chatMinHeight = 100;
var timer_id = false;
var handleAfterPageDownload =  '5' == '10' ? true : false;
var update_counter_on_details_tab = true;
var messages_queue = {
    handle_active: false,
    messages: [] 
};

// templates for JSmart
var message_templates = {
    daily_block: $("#messages_daily_block").length > 0 ? new jSmart($("#messages_daily_block")[0].innerHTML) : null,
    list_item: $("#messages_item_block").length > 0 ? new jSmart($("#messages_item_block")[0].innerHTML) : null,
    file_upload_item: $("#messages_file_item").length > 0 ? new jSmart($("#messages_file_item")[0].innerHTML) : null,
    message_from_support: $("#message_from_support").length > 0 ? new jSmart($("#message_from_support")[0].innerHTML) : null,
    message_from_writer: $("#message_from_writer").length > 0 ? new jSmart($("#message_from_writer")[0].innerHTML) : null,
    typing_msg_loader: $("#typing_msg_loader").length > 0 ? new jSmart($("#typing_msg_loader")[0].innerHTML) : null,
    new_ticket_message: $("#new_ticket_message").length > 0 ? new jSmart($("#new_ticket_message")[0].innerHTML) : null
};

var file_type_options = {
    empty: {
        id: '',
        text: '',
        selected: true
    },
    materials: {
        id: 'materials',
        text: 'Additional materials',
        selected: false
    },
    updates: {
        id: 'updates',
        text: 'Updated Version',
        selected: false
    },
    final: {
        id: 'final',
        text: 'Final',
        selected: false
    },
    draft: {
        id: 'draft',
        text: 'Draft',
        selected: false
    }
};

var max_textarea_width = false;

// START handling online/offline
function enableMessagesOnOnline(){
    $.each(
        form_blocks,
        function(iter, form_block){
            $(form_block).find('.submit_btn').removeClass('btn-disabled-msg');
            message_tabs_scroll.blocks[iter].find('.error-conection').hide();
        }
    );
    
    var current_tab_holder = (currentTabId == 1) ? message_tabs_scroll.blocks.support : message_tabs_scroll.blocks.writer;
    
    current_tab_holder.animate({ 
        scrollTop: current_tab_holder[0].scrollHeight
    }, 500);
    
    current_tab_holder.find('.offline-message-added').each(function(i, val) {
        $(val).removeClass('offline-message-added');
        $(val).parent().find('.msg-read:hidden').show();
        prepareMessage.call($(val), {text: $(val).text().trim()});
        
    })
}

function disableMessagesOnOffline() {    
    $.each(
        form_blocks,
        function(iter, form_block){
            $(form_block).find('.submit_btn').addClass('btn-disabled-msg');
            message_tabs_scroll.blocks[iter].find('.error-conection').show();
        }
    );
     
    var current_tab_holder = (currentTabId == 1) ? message_tabs_scroll.blocks.support : message_tabs_scroll.blocks.writer;
    current_tab_holder.animate({ 
        scrollTop: current_tab_holder[0].scrollHeight
    }, 500);
        
}

function disableMessagesOnOfflineTickets() {
    var form_block = $("#TicketFilesMessagesWrap .messages-body-wrap");
    $(form_block).find('.submit_btn').addClass('btn-disabled-msg');
    $('.messages-list-holder').find('.error-conection').show();
    $('.messages-list-holder').animate({ 
        scrollTop: 999999
    }, 500);
}

function enableMessagesOnOnlineTickets(){
     var form_block = $("#TicketFilesMessagesWrap .messages-body-wrap");
     $(form_block).find('.submit_btn').removeClass('btn-disabled-msg');
     $('.messages-list-holder').find('.error-conection').hide();    
     
    $('.messages-list-holder').find('.offline-message-added').each(function(i, val) {
        $(val).removeClass('offline-message-added');
        $(val).parent().find('.msg-read:hidden').show();
        prepareMessage.call($(val), {text: $(val).text().trim()});
        
    })
}


// END handling online/offline


// prepare message from textarea
function prepareMessage(online_handler) {
    // get form data
    var form = typeof online_handler == 'object' ? $(this).closest('.tab-content-inner').find('form') : $(this).parent().closest('form');
     if($('#TicketFilesMessagesWrap').length > 0 && typeof online_handler == 'object') {
         form = $('#TicketFilesMessagesWrap').find('form');
    }
    var message_text = typeof online_handler == 'object' ? online_handler.text : form.find('[name="message_text"]').val().trim();
    var recipient = form.find("[name='direction']").attr("data-recipient");
    var to_writer = (typeof recipient !== "undefined");
    
    var check_message_text = message_text.replace(/\s+/g, "").replace(/\n/g, "");
    if (check_message_text.length > 0 && /[а-яА-ЯЁё]/.test(check_message_text) === false) {
        if(form.find('.chat-textarea').data('ticket-message') && Object.keys(ticket_create.uploaded_files_ids).length > 0) {
            ticket_create.upload_files(ticket_create.submit_from_messages);
        }
    if(!is_online) {
        if(form.find('.chat-textarea').data('ticket-message')) {
            addNewMessageToTicket({from:CURRENT_USER.id, message:message_text}, false, true);
            disableMessagesOnOfflineTickets();
        } else {
            addMessage(message_text, form, false, false, true);
            disableMessagesOnOffline();
        }
      
        return false;
    }
        if(form.find('.chat-textarea').data('ticket-message')) {
            var data = form.serialize() 
                    + '&ticket_id=' + TICKET.id
                    + '&ticket_message=' + message_text;
                if(!online_handler) {
                addNewMessageToTicket({from:CURRENT_USER.id, message:message_text});
            }
                callAjax("json", "/tickets?ajax=AddTicketMessage", function(result) {}, data);                   
        } else {
            var data = (to_writer ? 
                        form.serialize() + "&recipient=" + recipient : 
                        form.serialize()
                    ) + '&message_text='+encodeURIComponent( Base64.encode(message_text) )
                      + '&return_message_data=true';  
                if(!online_handler) {
                        addMessage(message_text, form);
                }
                
                callAjax("json", "/messages?ajax=create", function(result) {
                     if (result.message_created == true && result.new_message_data.message_id) {
                             $('#tab'+currentTabId).find('.message-item-user').last().attr('data-message-id', result.new_message_data.message_id);        
                    }           
                }, data);
            
            }
            
            form.find('[name="message_text"]').val("");
            form.find('[name="message_text"]').trigger('input'); // for textarea resize
            form.find('.submit_btn').addClass('btn-disabled-msg');
        } else if(check_message_text.length == 0 && form.find('.chat-textarea').data('ticket-message') && Object.keys(ticket_create.uploaded_files_ids).length > 0) {
            ticket_create.upload_files(ticket_create.submit_from_messages);
        }

   

    return false;
}
// END prepare message from textarea

// dynamically add message to list
function addMessage(message_text, form_obj, message_id, is_file, offline) {
    // get last daily-message holder
    var last_messages_holder = form_obj.parent().closest(".chat-wrapper").find('.messages-list-holder .messages-items-wrap .messages-holder .message-list-holder').last();
    var current_datetime = new Date();
    var day_timestamp = new Date(current_datetime.getFullYear(), current_datetime.getMonth(), current_datetime.getDate());
    var message_data_obj = {
        in_development: typeof $.cookie('test_office') !== 'undefined' ? true : false,
        today_timestamp: Math.round(day_timestamp.getTime()/1000),
        message: {
            id: message_id,
            username: (CURRENT_USER.name.length > 0 && CURRENT_USER.name !== 'Customer') ? CURRENT_USER.name : 'Customer',
            text: is_file == true ? croppString(message_text, 167, 7) : message_text,
            time: Math.round(current_datetime.getTime()/1000),
            message_type: is_file == true ? 'file' : false,
            offline: offline 
        },
        avail_order: ORDER
    };
     
    if(message_data_obj.today_timestamp == parseInt(last_messages_holder.attr('data-daytime'))){
        // if last daily-message is today
        var parsed_message = message_templates.list_item.fetch(message_data_obj);
        last_messages_holder.append(parsed_message);
    } else {
        // if today-holder does not exists
        var parsed_message = message_templates.daily_block.fetch(message_data_obj);
        if(last_messages_holder.length > 0) {
            last_messages_holder.after(parsed_message);
        } else {
            form_obj.parent().closest(".chat-wrapper").find('.messages-list-holder .messages-items-wrap .messages-holder').append(parsed_message);
        }
            
    }
    
    form_obj.parent().closest('.chat-wrapper').find(".empty-messages").hide();
    form_obj.parent().closest('.chat-wrapper').find(".messages-items-wrap").show();
    
    var tab = form_obj.parent().closest(".tab-content-msg");
    
    var current_scroll_pane = false;
    if(tab.attr('id') == "tab1" && message_tabs_scroll.blocks.support.length > 0) {
        current_scroll_pane = message_tabs_scroll.blocks.support;
    } else if(tab.attr('id') == "tab2" && message_tabs_scroll.blocks.writer.length > 0) {
        current_scroll_pane = message_tabs_scroll.blocks.writer;
    }
    
    if(current_scroll_pane !== false) {
        // scrollToBottom
        current_scroll_pane.animate({ 
            scrollTop: current_scroll_pane[0].scrollHeight 
        }, 500);
    }  
}

function croppString(string, length_left, length_right) {
    
    if((length_left + length_right + 5) > string.length) {
        return string;
    } else {
        return string.substr(0, length_left) + "..." + string.substr(length_right*(-1));
    }
}

// read messages and upd counters
function handleMessagesScroll(firstSroll){
    // choose current messages tab
    var current_tab_holder = typeof TICKET == 'object' ? $(".messages-list-holder") : ((currentTabId == 1) ? message_tabs_scroll.blocks.support : message_tabs_scroll.blocks.writer);
    
    var first_unread_msg_block = current_tab_holder.find(".unread-msg").first();
    if(current_tab_holder.length === 0) {
        return false;
    }

     if(firstSroll) {
         message_tabs_scroll.scrolled.support = false;
         message_tabs_scroll.scrolled.writer = false;
            return false;
        }
       
    if( // if exists unreaded msg
        first_unread_msg_block.length !== 0 
        && ( // if scroll position > unreaded msg position
            (current_tab_holder.scrollTop() + current_tab_holder.height())
        ) > first_unread_msg_block.position().top
    ) {
     
        first_unread_msg_block.removeClass('unread-msg');
        if(typeof TICKET == 'object') {
            current_tab_holder.find(".scrollbottom .msg-quantity").html(0);
            current_tab_holder.find('.scrollbottom').removeClass('show');
            return false;
        }

        var message_id = first_unread_msg_block.attr('data-message-id'),
            message_type = first_unread_msg_block.attr('data-message-type'),
            url,
            data
    
        message_type == 1 ?  (url = '/messages?ajax=markAsProcessed' ,
                             data = {id: message_id}) 
                          :  (url = '/files?ajax=CheckReaded',
                             data = {array_id_files: [message_id]})
        
        callAjax('json', url, function(data) {
            if (data.result === true) {
                subtractSidebarMessageCounter();
                var count_unread_by_tab = parseInt(current_tab_holder.find(".scrollbottom .msg-quantity").html())-1;
                if( isNaN(count_unread_by_tab) ) {
                    if(currentTabId == 1) {
                        var count_unread_by_tab_holder = parseInt($('.count-unread-sprt'));
                        count_unread_by_tab_holder.length > 0 ? count_unread_by_tab = parseInt(count_unread_by_tab_holder.html()) : count_unread_by_tab = 0;       
                    } else {
                      var count_unread_by_tab_holder = parseInt($('.count-unread-sprt'));
                        count_unread_by_tab_holder.length > 0 ? count_unread_by_tab = parseInt(count_unread_by_tab_holder.html()) : count_unread_by_tab = 0;
                    }
                   
                }
                
                if(count_unread_by_tab === 0) { // if it was last unreaded for this tab
                    current_tab_holder.find(".scrollbottom .msg-quantity").detach();
                    $(".tabs-msg .tab-chat[data-tab='tab"+currentTabId+"'] .count-unread").detach();

                    // check total unreaded msgs counter
                    var count_unread_total = parseInt($(".tabs-list .tab-link[data-tab='tab-2'] .counter").html()) - 1;
                    if(count_unread_total === 0) {
                        $(".tabs-list .tab-link[data-tab='tab-2'] .counter").detach();
                    } else {
                        $(".tabs-list .tab-link[data-tab='tab-2'] .counter").html(count_unread_total);
                    }
                } else { // update tabs counters
                    current_tab_holder.find(".scrollbottom .msg-quantity").html(count_unread_by_tab);
                    $(".tabs-msg .tab-chat[data-tab='tab"+currentTabId+"'] .count-unread").html(count_unread_by_tab);
                    // check total unreaded msgs counter
                    var count_unread_total = parseInt($(".tabs-list .tab-link[data-tab='tab-2'] .counter").html()) - 1;
                    if(count_unread_total === 0) {
                        $(".tabs-list .tab-link[data-tab='tab-2'] .counter").detach();
                    } else {
                        $(".tabs-list .tab-link[data-tab='tab-2'] .counter").html(count_unread_total);
                    }
                }
            }
        }, data);
    }
    
    if(typeof TICKET == 'undefined') {
    // check for scrollbottom-arrow show/hide
        var scroll = current_tab_holder.scrollTop();

        if (scroll > current_tab_holder.find('.messages-items-wrap').height() - $(this).height() - 100) {
            current_tab_holder.find('.scrollbottom').removeClass('show');
        }
        else {
            current_tab_holder.find('.scrollbottom').addClass('show');
        }
        position = scroll;
    }
}

function calculateMessagesListHeight() { // calculate messages-holder height if resizing window
    var total_page_height = $('#content-wrapper').height(),
        header_height = $('#content .navbar').outerHeight(true),
        order_tabs_height = $('#content .writers-list-inner .tabs-list').length > 0 ? $('#content .writers-list-inner .tabs-list').outerHeight(true) : 0,
        messages_menu_height = $('#content .chat-tab-menu').length > 0 ? $('#content .chat-tab-menu').outerHeight(true) : 0,
        message_form_height = $('#content .tab-content-msg.current .messages-body-wrap').outerHeight(true),
        order_wrapper_padd_bott = parseInt($('#content .order-wrapper').css('padding-bottom')),
        order_details_header_height = $('.order-title-inner.active .order-title-container').outerHeight(true),
        ticket_detailed_head = $('.ticket-detailed-head').length > 0 ? $('.ticket-detailed-head').outerHeight(true) : 0,
        body_header_bnrs = $('[data-calc-chat-heigth]').length > 0 ? $('[data-calc-chat-heigth]').outerHeight(true) : 0;

    return total_page_height - header_height - order_tabs_height 
            - messages_menu_height - message_form_height - order_wrapper_padd_bott - order_details_header_height - ticket_detailed_head;
}

function resizeMessageHolders() {
    var chatBaseHeight = calculateMessagesListHeight();
    $.each(
        $('.chat-wrapper .messages-list-holder'),
        function(iter, chatBlock) {
            var error_connection_h = $(chatBlock).find('.error-conection:visible').length > 0 ? $(chatBlock).find('.error-conection:visible').outerHeight(true) : 0;
            var error_sending_h = $(chatBlock).find('.error-sending:visible').length > 0 ? $(chatBlock).find('.error-sending:visible').outerHeight(true) : 0;

            // check for min message-holder height
            if(chatBaseHeight - error_connection_h - error_sending_h > chatMinHeight) {
                $(chatBlock).css('height', chatBaseHeight + 'px');
            } else {
                $(chatBlock).css('height', (chatMinHeight+error_connection_h+error_sending_h) + 'px');
            }
        }
    );
}

function handleServiceRateClick() {
    rate_data.service.value = $(this).val();
    
    var message_block = $(this).closest('.message-item');
    if(parseInt($(this).val()) >= 4){ // high rate
        sendServiceRate(message_block.attr('data-message-id'));
        $(this).parents('.set_rate-support_msg').hide();
        $(this).closest('.message-item').find('.high-rate-support_msg').show();
     } else { // low value
         $(this).parents('.set_rate-support_msg').hide();
         $(this).closest('.message-item').find('.low-rate-support_msg').show();
     }
}

function validateServiceRateComment() {
    var feedback_val = $(this).val();
    var low_rate_block = $(this).closest('.low-rate-support_msg');
    
    if(feedback_val.length < 3) {
        $(this).addClass('error');
        low_rate_block.find('.alert-required').html(rate_data.service.errors.empty).show();
        return false;
        
    } else if (rate_data.service.regex.test(feedback_val) !== true) {
        $(this).addClass('error');
        low_rate_block.find('.alert-required').html(rate_data.service.errors.symbols).show();
        return false;
    
    } else {
        $(this).removeClass('error');
        low_rate_block.find('.alert-required').hide();
        
        return true;
    }
}

function handleServiceRateFeedbackAdd() {
    var low_rate_block = $(this).closest('.low-rate-support_msg');
    var feedback_val = low_rate_block.find('textarea[name="feedback_support"]').val();
    
    
    var comment_valid = validateServiceRateComment.call(low_rate_block.find('textarea[name="feedback_support"]').get());
    
    if(comment_valid) {
        low_rate_block.hide();
        $(this).closest('.message-item').find('.high-rate-support_msg').show();
        
        rate_data.service.feedback = feedback_val.length >= 3 ? feedback_val : "";
        
        sendServiceRate(low_rate_block.closest('.message-item').attr('data-message-id'));
    }
//    if(feedback_val.length < 3) {
//        low_rate_block.find('.alert-required').html(rate_data.service.errors.empty).show();
//        return false;
//        
//    } else if (rate_data.service.regex.test(feedback_val) !== true) {
//        low_rate_block.find('.alert-required').html(rate_data.service.errors.symbols).show();
//        return false;
//    
//    } else {
//        low_rate_block.find('.alert-required').hide();
//        
//        low_rate_block.hide();
//        $(this).closest('.message-item').find('.high-rate-support_msg').show();
//    }
}

function sendServiceRate(message_id) {
    callAjax('json', 
        '/orders?ajax=ServiceRate', 
        function(data) {}, 
        {
            id: ORDER.id,
            service_rate: rate_data.service.value,
            feedback: (rate_data.service.feedback && rate_data.service.feedback.length > 0) ? rate_data.service.feedback : "",
            message_id: message_id
        });
}

function chatPreviewCategoryChange(self) {
    if($(self).hasClass('tab-link-active') && currentTabStatus == 'active') {
               return false;
            } else if($(self).hasClass('tab-link-archive') && currentTabStatus == 'active') {
                currentTabStatus = 'archive';
                 $('.chat_preview-inner .tab_link_active').hide();
                $('.chat_preview-inner .tab_link_archive').show();
            } else if($(self).hasClass('tab-link-archive') && currentTabStatus == 'archive') {
                return false;
            } else if($(self).hasClass('tab-link-active') && currentTabStatus == 'archive') {
                 currentTabStatus = 'active';
                $('.chat_preview-inner .tab_link_archive').hide();
                $('.chat_preview-inner .tab_link_active').show();
            }
}


function addNewMessage(message) {
    if(!messages_queue.handle_active) {
        messages_queue.handle_active = true;
    var activeTab = $('#tab' + currentTabId);
    var last_messages_holder = activeTab.find('.messages-list-holder .messages-items-wrap .messages-holder .message-list-holder').last();
    if (checkAddMessageToThisTab(message)) {
        if (message.hasOwnProperty('text')) {
                var promise = new Promise(function (resolve, reject) {              
                    addTypingMsgLoader(last_messages_holder, message);
                    var seconds = Math.round(4000 + Math.random() * 2000);
                    setTimeout(function () {
                        last_messages_holder.find('.message-item').last().remove();
                        resolve(1);
                        }, seconds);
                    });
                    promise.then(function () {
                      
                        addMessageFromSenderToCurentTab(message, last_messages_holder, !$('[data-tab-item-messages]').hasClass('current')); 
                        messages_queue.handle_active = false;
                    });
        }
    } else {                  
            var another_chat_tab_id = currentTabId == 1 ? 2 : 1;
            addMessageFromSenderToAnotherTab(message, another_chat_tab_id);
            
    }
    } else {
        messages_queue.messages.push(message);
        if(messages_queue.messages.length > 0) {
            setTimeout(function() {  addNewMessage(messages_queue.messages.shift());}, 4000)
        }
    }
    
}

function addNewMessageToTicket(message_obj, from_support, offline) {
    var current_datetime = new Date();
    var message_data_obj = {
        current_user: CURRENT_USER,
        message: {
            user: message_obj.from == 'support' ? 'Help Desk Representative' : CURRENT_USER.id,
            message: message_obj.message,
            creation_date: Math.round(current_datetime.getTime() / 1000),
            message_type: message_obj.is_file ? 'file' : false,
            offline: offline 
        }
    };
    var last_messages_holder = $('.messages-list-holder .messages-items-wrap .messages-holder .message-list-holder').last();
    var parsed_message = message_templates.new_ticket_message.fetch(message_data_obj);
    last_messages_holder.append(parsed_message);
  
    if(!from_support) {
        $(".messages-list-holder").animate({ scrollTop: 9999999 }, 0);
    } else {
        
        $('.scrollbottom-light-grey').find('.msg-quantity').text(++parseInt($('.scrollbottom-light-grey').find('.msg-quantity').text()));
        if(!$('.scrollbottom-light-grey').hasClass('show')) {
            $('.scrollbottom-light-grey').addClass('show');
        }
    }
//    if(from_support) {
//        console.log('from support ticket');
//        setTimeout(function() {               
//             callAjax('json', '/tickets?ajax=TicketMessageSetReaded', function (data) {
//        }, {message_id: message_obj.id});
//            changeSidebarData();
//        }, 2000) 
//            
//    }
    if(!from_support) {
        changeSidebarData();
    }
}
       
function changeMessageStatusToReaded(message_id) {
    if (message_id) {
        var status = $('.message-item[data-message-id="' + message_id + '"]').find('.msg-read');
        status.removeClass('msg-read');
        status.addClass('msg-delivered');
    }
}

function changeClientStatusOnline(data) {
    var activeTab = $('#tab' + currentTabId);
    var curent_writer_status = currentTabId == 2 ? activeTab.find('.msg-caption-writer .active-status').length > 0 ? 1 : 0 : null;
       if (data.status && data.status != curent_writer_status) {
            if (data.status == 1) {
                activeTab.find('.msg-caption-writer').append('<div class="active-status"></div>');
            } else if (data.status == 0) {
                activeTab.find('.msg-caption-writer .active-status').detach();
            }
        }
}


function checkAddMessageToThisTab(message_obj) {
    var addToCurentTab = false;
    if (currentTabId == 1 && message_obj.from == 'support') {
        addToCurentTab = true;
    } else if (currentTabId == 2 && message_obj.from == 'client') {
        addToCurentTab = true;
    }
    return addToCurentTab;
}

function addTypingMsgLoader(last_messages_holder, message_obj) {
  if(message_obj.direction == 2) {
       var writer_status_online = $('#tab2').find('.msg-caption-writer');
       writer_status_online.each(function(index, value) {
           if($(value).find('.active-status').length == 0) {
               $(value).append('<div class="active-status"></div>');
           }
       });
     
  }
    var message_data_obj = {
        message: {
            username: message_obj.from == 'support' ? 'Support' : 'Client #' + ORDER.client,
            direction: message_obj.from == 'support' ? 3 : 2,
            messages_tab_id: currentTabId
        }
    };

    var loader = message_templates.typing_msg_loader.fetch(message_data_obj);
    last_messages_holder.append(loader);
    scrollToNewMessage(false);
}

function scrollToNewMessage(message_id, message_type) {

    $('#tab' + currentTabId).parent().closest('.chat-wrapper').find(".empty-messages").hide();
    $('#tab' + currentTabId).parent().closest('.chat-wrapper').find(".messages-items-wrap").show();

    var tab = $('#tab' + currentTabId).parent().closest(".tab-content-msg");

    var current_scroll_pane = false;
    if (currentTabId == 1 && message_tabs_scroll.blocks.support.length > 0) {

        current_scroll_pane = message_tabs_scroll.blocks.support;
    } else if (currentTabId == 2 && message_tabs_scroll.blocks.writer.length > 0) {
        current_scroll_pane = message_tabs_scroll.blocks.writer;
    }

    if (current_scroll_pane !== false) {
        // scrollToBottom
        current_scroll_pane.animate({
            scrollTop: current_scroll_pane[0].scrollHeight
        }, 500);
    }
    if (message_id && message_type != 'file') {
        callAjax('json', '/messages?ajax=markAsProcessed', function (data) {
        }, {id: message_id});
    }
} 

function addMessageFromSenderToCurentTab(message_obj, last_messages_holder, from_another_tab_orders_page) {
    var current_datetime = new Date();
    var day_timestamp = new Date(current_datetime.getFullYear(), current_datetime.getMonth(), current_datetime.getDate());
    var message_data_obj = {
        today_timestamp: Math.round(day_timestamp.getTime() / 1000),
        message: {
            username: message_obj.from == 'support' ? 'Support' : ORDER.client,
            direction: message_obj.from == 'support' ? 3 : 2,
            id: message_obj.id,
            text: message_obj.text,
            approved_for_client_date: Math.round(current_datetime.getTime()/1000),
            messages_tab_id: currentTabId
        }
    };
    if (message_obj.hasOwnProperty('message_type')) {
        message_data_obj.message['message_type'] = message_obj.message_type
    }
     
    if(from_another_tab_orders_page) {
        message_data_obj.message['has_unread_messages'] = 0
        message_data_obj.message['from_another_tab_orders_page'] = 1;
    }

    if (message_obj.from == 'client') {
        var parsed_message = message_templates.message_from_writer.fetch(message_data_obj);
    } else if (message_obj.from == 'support') {
        var parsed_message = message_templates.message_from_support.fetch(message_data_obj);
    }
    if (checkAddMessageToThisTab(message_obj)) {
//     get last daily-message holder
        if (message_data_obj.today_timestamp == parseInt(last_messages_holder.attr('data-daytime'))) {
            // if last daily-message is today
            last_messages_holder.append(parsed_message);
        } else {
            // if today-holder does not exists
            var parsed_message = message_templates.daily_block.fetch(message_data_obj);
            if (last_messages_holder.length > 0) {
                last_messages_holder.after(parsed_message);
            } else {
                last_messages_holder.append(parsed_message);
            }

        }   
        if(from_another_tab_orders_page) {
              addUnreadMessageCounter(currentTabId);
        } else {
             scrollToNewMessage(message_obj.id, message_data_obj.message['message_type']);
        }
        
       
    }  
    if(message_obj.hasOwnProperty('message_type') && message_obj.message_type == 'file') {
        appendWriterFile({
            id: message_obj.id,
            owner_id: message_obj.from == 'support' ? 'support' : ORDER.client,
            direction: message_obj.from == 'support' ? 3 : 2,
            name: $(message_obj.text).text(),
            creation_date: Math.floor(Date.now() / 1000),
            approved_for_writer: Math.floor(Date.now() / 1000),
            final: message_obj.file_type.final,
            draft: message_obj.file_type.draft,
            materials: message_obj.file_type.materials,
            report: message_obj.file_type.report,
            updates: message_obj.file_type.updates
        }, from_another_tab_orders_page);
    }
}

function addMessageFromSenderToAnotherTab(message_obj, tab_id) {
    var current_datetime = new Date();
    var day_timestamp = new Date(current_datetime.getFullYear(), current_datetime.getMonth(), current_datetime.getDate());
    var message_data_obj = {
        today_timestamp: Math.round(day_timestamp.getTime() / 1000),
        message: {
            username: message_obj.from == 'support' ? 'Support' : ORDER.client,
            direction: message_obj.from == 'support' ? 3 : 2,
            id: message_obj.id,
            text: message_obj.text,
            time: Math.round(current_datetime.getTime() / 1000),
            messages_tab_id: tab_id,
            has_unread_messages: 0,
            approved_for_client_date: Math.round(current_datetime.getTime() / 1000)
        }

    };
    
     if (message_obj.hasOwnProperty('message_type')) {
        message_data_obj.message['message_type'] = message_obj.message_type
    }

    var activeTab = $('#tab' + tab_id);
    var last_messages_holder = activeTab.find('.messages-list-holder .messages-items-wrap .messages-holder .message-list-holder').last();
   
    if(last_messages_holder.length == 0 && tab_id == 2) {
        $('#tab'+tab_id).find('.empty-messages').hide();
        last_messages_holder = $('#tab'+tab_id).find('.messages-items-wrap .messages-holder')
        $('#tab'+tab_id).find('.messages-items-wrap').show();
        var new_holder = true;
        message_data_obj['has_unread_messages_first_from_writer'] = 1
    } else {
        var new_holder = false
    }
    

    var unreadMessages = last_messages_holder.find('.unread_msgs');

    if (unreadMessages.length == 0) {
        message_data_obj['has_unread_messages'] = 0
    }
   
    if (message_obj.from == 'client') {
        message_tabs_scroll.scrolled.writer = false;
        var parsed_message = message_templates.message_from_writer.fetch(message_data_obj);

    } else if (message_obj.from == 'support') {    
        message_tabs_scroll.scrolled.support = false;
        var parsed_message = message_templates.message_from_support.fetch(message_data_obj);
    } else {
        return false;
    }  
//     get last daily-message holder
    if (message_data_obj.today_timestamp == parseInt(last_messages_holder.attr('data-daytime'))) {
        if (unreadMessages.length == 0) {
            last_messages_holder.append('<div class="unread_msgs">Unread Messages</div>');
        }
        // if last daily-message is today
        last_messages_holder.append(parsed_message);
    } else {    
        // if today-holder does not exists
        var parsed_message = message_templates.daily_block.fetch(message_data_obj);
        if (last_messages_holder.length > 0 && !new_holder) {
            last_messages_holder.after(parsed_message);
        } else {
            last_messages_holder.append(parsed_message);
        }
    }
       
    if(message_obj.hasOwnProperty('message_type') && message_obj.message_type == 'file') {
        appendWriterFile({
            id: message_obj.id,
            owner_id: message_obj.from == 'support' ? 'support' : ORDER.client,
            direction: message_obj.from == 'support' ? 3 : 2,
            name: $(message_obj.text).text(),
            creation_date: Math.floor(Date.now() / 1000),
            approved_for_writer: Math.floor(Date.now() / 1000),
            final: message_obj.file_type.final,
            draft: message_obj.file_type.draft,
            materials: message_obj.file_type.materials,
            report: message_obj.file_type.report,
            updates: message_obj.file_type.updates
        }, true);
    }
    
    addUnreadMessageCounter(tab_id);
    

}
function addUnreadMessageCounter(tabToAdd) {
    var current_tab_unread = $(".tabs-msg .tab-chat[data-tab='tab" + tabToAdd + "']").find('.count-unread');
    addSidebarMessageCounter(1);
    addMessageCounterOnDetailsPageMessagesTab(1);
    
    if (current_tab_unread.length == 0) {
        if (tabToAdd == 1) {
           $(".tabs-msg .tab-chat[data-tab='tab" + tabToAdd + "']").append('<span class="count-unread-sprt count-unread">1</span>');
        } else {
            $(".tabs-msg .tab-chat[data-tab='tab" + tabToAdd + "']").append('<span class="count-unread-wtr count-unread">1</span>');
        }
    } else {
        var newValue = parseInt(current_tab_unread.html()) + 1;
        current_tab_unread.html(newValue)
    }
}

function addSidebarMessageCounter(count_messages) {
    var sidebar_counter_unread = $('.nav-link[href="/messages"]').parent().find('.counter');
    var sidebar_counter_orders = $('.nav-link[href="/my_orders"]').parent().find('.counter');
    if (sidebar_counter_unread.length > 0) {
        var new_count_unread = parseInt(sidebar_counter_unread.html()) + count_messages;
        sidebar_counter_unread.html(new_count_unread)
    } else {
        $('.nav-link[href="/messages"] .nav-link-item').append('<span class="counter">'+count_messages+'</span>')
    }
     if (sidebar_counter_orders.length > 0) {
        var new_count_unread = parseInt(sidebar_counter_orders.html()) + count_messages;
        sidebar_counter_orders.html(new_count_unread)
    } else {
        $('.nav-link[href="/orders"] .nav-link-item').append('<span class="counter">'+count_messages+'</span>')
    }
}

function subtractSidebarMessageCounter() {
    var sidebar_counter_unread = $('.nav-link[href="/messages"]').parent().find('.counter');
    var sidebar_counter_orders = $('.nav-link[href="/my_orders"]').parent().find('.counter');
    var new_count_unread = parseInt(sidebar_counter_unread.html() - 1);
    if (new_count_unread == 0) {
        sidebar_counter_unread.detach();
    } else {
        sidebar_counter_unread.html(new_count_unread);
    }
    var new_count_unread_orders = parseInt(sidebar_counter_orders.html()) - 1;
    if (new_count_unread_orders == 0) {
         sidebar_counter_orders.detach();
    } else {
       sidebar_counter_orders.html(new_count_unread_orders);
    }
}

                 
function addMessageCounterOnDetailsPageMessagesTab(count_messages) {
    var old_counter_elem = $('[data-tab-item-messages]').find('.counter');
    if(old_counter_elem.length > 0) {
        var new_count = parseInt(parseInt(old_counter_elem.html()) + parseInt(count_messages));
        old_counter_elem.html(new_count);
    } else {
        $('[data-tab-item-messages] span').append('<span class="counter">'+count_messages+'</span>');
    }
}

$(document).ready(function () {
    // mark as read messages on hover
    $(".message-item-writer.message-item").hover(function (){

        message_obj = $(this);
        message_id = message_obj.data("message-id");

        if(message_obj.data("readed") == "1"){
            return false;
        }else {
            message_obj.data("readed", "1");
        }

        callAjax('json', '/messages?ajax=markAsProcessed', function(data) {
            if (data.result === true) {

                var current_tab_holder = (currentTabId == 1) ? message_tabs_scroll.blocks.support : message_tabs_scroll.blocks.writer;

                subtractSidebarMessageCounter();
                var count_unread_by_tab = parseInt(current_tab_holder.find(".scrollbottom .msg-quantity").html())-1;
                if( isNaN(count_unread_by_tab) ) {
                    if(currentTabId == 1) {
                        var count_unread_by_tab_holder = parseInt($('.count-unread-sprt'));
                        count_unread_by_tab_holder.length > 0 ? count_unread_by_tab = parseInt(count_unread_by_tab_holder.html()) : count_unread_by_tab = 0;
                    } else {
                        var count_unread_by_tab_holder = parseInt($('.count-unread-sprt'));
                        count_unread_by_tab_holder.length > 0 ? count_unread_by_tab = parseInt(count_unread_by_tab_holder.html()) : count_unread_by_tab = 0;
                    }
                }

                if(count_unread_by_tab === 0) { // if it was last unreaded for this tab
                    current_tab_holder.find(".scrollbottom .msg-quantity").detach();
                    $(".tabs-msg .tab-chat[data-tab='tab"+currentTabId+"'] .count-unread").detach();

                    // check total unreaded msgs counter
                    var count_unread_total = parseInt($(".tabs-list .tab-link[data-tab='tab-2'] .counter").html()) - 1;
                    if(count_unread_total === 0) {
                        $(".tabs-list .tab-link[data-tab='tab-2'] .counter").detach();
                    } else {
                        $(".tabs-list .tab-link[data-tab='tab-2'] .counter").html(count_unread_total);
                    }
                } else { // update tabs counters
                    current_tab_holder.find(".scrollbottom .msg-quantity").html(count_unread_by_tab);
                    $(".tabs-msg .tab-chat[data-tab='tab"+currentTabId+"'] .count-unread").html(count_unread_by_tab);
                    // check total unreaded msgs counter
                    var count_unread_total = parseInt($(".tabs-list .tab-link[data-tab='tab-2'] .counter").html()) - 1;
                    if(count_unread_total === 0) {
                        $(".tabs-list .tab-link[data-tab='tab-2'] .counter").detach();
                    } else {
                        $(".tabs-list .tab-link[data-tab='tab-2'] .counter").html(count_unread_total);
                    }
                }
            }
        }, {
            id: message_id
        });
    });

  // trigger init click to current chat tab when on messages tab
  $(document).on('click', '.writers-list-inner [data-tab="tab-2"]', function() {
        $('.chat-tab-menu .tabs-msg .tab-chat.current').trigger('click', true);
        $('[data-message-type=2] .file-title-msg').each(function(index, item) {
          $(item).text(croppString($(item).text(), 80, 7)); 
        });
  }); 
    
       message_tabs_scroll = {
        blocks: {
            support: $(".order-messages .tab-content-support .chat-wrapper>.messages-list-holder"),
            writer: $(".order-messages .tab-content-writer .chat-wrapper>.messages-list-holder")
        },
        top: {
            support: 0,
            writer: 0
        },
        scrolled: {
            support: false,
            writer: false
        },
        textareaBlocks: {
            support: false,
            writer: false
        },
        minHeight: 100
    };
    
    
    //tabs Active/Archive on chat preview
    $('.chat_preview-filter .tabs-list .tab-link').on('click', function() {
           var self = this;
           chatPreviewCategoryChange(self);
    });
    
    $('.chat_preview-item').on('click', function() {
        if($('.chat_preview-item').hasClass('chat_preview-active')) {
            $('.chat_preview-item.chat_preview-active').removeClass('chat_preview-active') 
            $(this).addClass('chat_preview-active');
            var order_id = $(this).data('chat_to_order_id');
            var elem = $('.new_chat-tab.chat-tab');
            var elemWithOrderId = $(elem.selector + '[data-order_chat_id='+order_id+']');
//             var elem = $('.new_chat-tab.chat-tab[data-order_chat_id='+order_id+']');
            if(elem.is(':visible')) {
                elem.hide();
            } 
            elemWithOrderId.show();
        } else {
          $(this).addClass('chat_preview-active');
        }
    });
    
    form_blocks = {
        support: $(".order-messages .tab-content-support .messages-body-wrap"),
        writer: $(".order-messages .tab-content-writer .messages-body-wrap")
    };
    
    $( window ).resize(function() {
        // resize textareas
        max_textarea_width = $("#tab" +currentTabId+' .chat-wrapper .messages-body-wrap').width() -  $("#tab" +currentTabId+' .chat-wrapper .messages-body-wrap .messeges-btn-holder').width() - 25;
        $("#tab" +currentTabId+' .chat-wrapper .chat-textarea').css('max-width', max_textarea_width+'px');
        
        // resize message-holders
        resizeMessageHolders();
        
    });
    
    resizeMessageHolders();
    
    $(document).on('click', 'ul.tabs-msg li', function (event, fromAnotherTab) {
        
        message_tabs_scroll = {
            blocks: {
                support: $(".order-messages .tab-content-support .chat-wrapper>.messages-list-holder"),
                writer: $(".order-messages .tab-content-writer .chat-wrapper>.messages-list-holder")
            },
            top: {
                support: 0,
                writer: 0
            },
            scrolled: {
                support: false,
                writer: false
            },
            textareaBlocks: {
                support: false,
                writer: false
            },
            minHeight: 100
    };  

        if(handleAfterPageDownload) {
            handleAfterPageDownload = false;
            return false;       
        }
        // add current classes + define vars
        var tab_id = $(this).attr('data-tab');
        currentTabId = tab_id.replace("tab", "");
        $('ul.tabs-msg li').removeClass('current');
        $('.tab-content-msg').removeClass('current');
       
        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
        var scrollPaneMessages = (currentTabId == 1) ? message_tabs_scroll.blocks.support : message_tabs_scroll.blocks.writer;
        var scrollTextareaBlock = $("#" +tab_id+' .chat-textarea').length > 0 ? $("#" +tab_id+' .chat-textarea') : false;
        max_textarea_width = $("#" +tab_id+' .chat-wrapper .messages-body-wrap').width() -  $("#" +tab_id+' .chat-wrapper .messages-body-wrap .messeges-btn-holder').width() - 25;
        $("#" +tab_id+' .chat-wrapper .chat-textarea').css('max-width', max_textarea_width+'px');
        switch (tab_id) {
            case 'tab1': // support-tab
                if(!message_tabs_scroll.scrolled.support && scrollPaneMessages.length > 0) {
                    // if first tab show scroll to ...
                    message_tabs_scroll.textareaBlocks.support = scrollTextareaBlock;

                    if (message_tabs_scroll.blocks.support.find(".unread_msgs").length > 0) {
                        // ... first unreaded
                        setTimeout(function() {
                            message_tabs_scroll.top.support = message_tabs_scroll.blocks.support.find(".unread_msgs").position().top - 25;                           
                        }, 100)
                        
                    } else {
                        // ... end of message-holder
                        message_tabs_scroll.top.support = 999999;
                    }
                    // do scroll
                   var delay = fromAnotherTab ? 250 : 0 ;
                    setTimeout(function() {
                         message_tabs_scroll.blocks.support.animate({ 
                        scrollTop: message_tabs_scroll.top.support
                    }, 0);
                    }, delay);
                   
                    
                    message_tabs_scroll.scrolled.support = true;
                    // handle if not initialized
                    if(message_tabs_scroll.top.support < message_tabs_scroll.blocks.support.height()){
                             handleMessagesScroll.call(message_tabs_scroll.blocks.support);
                      
                    }
                    
                    // remove "unread messages" line
                    setTimeout(function(){
                        message_tabs_scroll.blocks.support.on('scroll', function(){
                            if(message_tabs_scroll.blocks.support.find('.unread_msgs').length) {
                                message_tabs_scroll.blocks.support.find('.unread_msgs').detach();
                            }
                        });
                    }, 1000);
                }
                
                break;
            case 'tab2': // writer-tab
                if(!message_tabs_scroll.scrolled.writer && scrollPaneMessages.length > 0) {
                    // if first tab show scroll to ...
                    message_tabs_scroll.textareaBlocks.writer = scrollTextareaBlock;
                    
                    if (message_tabs_scroll.blocks.writer.find(".unread_msgs").length > 0) {
                        // ... first unreaded
                         setTimeout(function() {
                        message_tabs_scroll.top.writer = message_tabs_scroll.blocks.writer.find(".unread_msgs").position().top - 25;
                    }, 100);
                    } else {
                        // ... end of message-holder
                        message_tabs_scroll.top.writer = 9999999;
                    }
                    // do scroll
                    var delay = fromAnotherTab ? 250 : 0 ;
                     setTimeout(function() {
                    message_tabs_scroll.blocks.writer.animate({ 
                        scrollTop: message_tabs_scroll.top.writer 
                    }, 0);
                    message_tabs_scroll.scrolled.writer = true;
                     }, delay);
                    // handle if not initialized
                    if(message_tabs_scroll.top.writer < message_tabs_scroll.blocks.writer.height()){
                           handleMessagesScroll.call(message_tabs_scroll.blocks.writer); 
                    }
                    
                    // remove "unread messages" line
                    setTimeout(function(){
                        message_tabs_scroll.blocks.writer.on('scroll', function(){
                            if(message_tabs_scroll.blocks.writer.find('.unread_msgs').length) {
                                message_tabs_scroll.blocks.writer.find('.unread_msgs').detach();
                            }
                        });
                    }, 1000);
                }
                break;
        }
        setTimeout(function() {
            resizeMessageHolders();
        }, 100);
        
    });
//    // change tab by default
//    if(!in_development) {
//    to DOOO
//      setTimeout(function() {
//              $('ul.tabs-msg li.current').click();
//      }, 1000)
    
//    }
    
    
    // scroll to bottom msg
    var position = $('.messages-list-holder').scrollTop();
    
//    $(document).on('scroll', '.messages-list-holder', function () {
//        handleMessagesScroll.call(this);
//    });
    
 document.addEventListener('scroll', function (event) {
    if ($(event.target).hasClass('messages-list-holder')) { // or any other filtering condition
        handleMessagesScroll.call($(event.target));
    }},true /*Capture event*/);

    $(document).on('click', '.scrollbottom', function () { // go to bottom click handle 
        // define vars  
        var handledBlock = $(this).hasClass('scroll_btn_ticket') ? $(".messages-list-holder") : ((currentTabId == 1) ? message_tabs_scroll.blocks.support : message_tabs_scroll.blocks.writer);
        if(handledBlock.length === 0) {
            return false;
        }
        
        var top_position = 0;
        if (handledBlock.find(".unread-msg").length > 0) { // if has unreaded
            if(handledBlock.find(".unread_msgs").length > 0) {
                if( // if scrollPosition > unreadedTitlePosition
                    (handledBlock.scrollTop()) 
                    > 
                    (
                        $("#tab"+currentTabId+" .unread_msgs").position().top 
                        - $("#tab"+currentTabId+" .unread_msgs").outerHeight() 
                        - 5
                    )
                ) {
                    // scroll to botom of holder
                    top_position = handledBlock.find('.messages-items-wrap').height();
                    handledBlock.animate({ 
                        scrollTop: top_position
                    }, 'slow', 'swing');
                } 
            } else {
                    // scroll to first unreaded
                    top_position = handledBlock.find(".unread-msg").first().position().top - 35;
                    handledBlock.animate({ 
                        scrollTop: top_position
                    }, 'slow', 'swing');
                }
       

        } else {
            // scroll to first unreaded
            top_position = handledBlock.find('.messages-items-wrap').height();
            handledBlock.animate({ 
                scrollTop: top_position
            }, 'slow', 'swing');
        }
            
        // upd base variables
        if(currentTabId == 1) {
            message_tabs_scroll.top.support = top_position;
        } else {
            message_tabs_scroll.top.writer = top_position;
        }
        
        return false;
    });
    
    // START online/offline handling
    window.addEventListener('offline', function(e){
        is_online = false;
        $.each(
            form_blocks,
            function(iter, form_block){
                $(form_block).find('.file_btn').attr('disabled', 'true');
            }
        );
//        disableMessagesOnOffline();
    });
    window.addEventListener('online', function(e){
        is_online = true;
        
        $.each(
            form_blocks,
            function(iter, form_block){
                $(form_block).find('.file_btn').removeAttr('disabled');
            }
        );
        if($("#TicketFilesMessagesWrap").length > 0) {
            enableMessagesOnOnlineTickets();
        } else {
            enableMessagesOnOnline();
        }
             
    });
    // END online/offline handling
    
    
    // check for enable/disable send button
    $(document).on('input', '.messages-body-wrap textarea', function(){
        var check_message_text = $(this).val().replace(/\s+/g, "").replace(/\n/g, "");
        if(
            check_message_text.length > 0 
            && /[а-яА-ЯЁё]/.test(check_message_text) === false 
            && (
                $(this).closest('.tab-content-msg').attr('id') === 'tab1' 
                || (typeof ORDER !== 'undefined' && $.inArray(parseInt(ORDER.status_id), [17, 18, 19])) === -1
                || (typeof TICKET !== 'undefined') && TICKET.archived == 0
            )
        ) {
            $(this).parent().closest('form').find('.submit_btn')
                    .removeAttr('disabled').removeClass('btn-disabled-msg');
        } else {
            $(this).parent().closest('form').find('.submit_btn')
                    .attr('disabled', true).addClass('btn-disabled-msg');
        }
    });
    
    
    $(document).on('click', '.messages-body-wrap .submit_btn', function() {
        prepareMessage.call($(this));
    });
    
    $(document).on('keypress', '.messages-body-wrap textarea', function(e) {
        if (
            e.ctrlKey 
            && (
                e.keyCode == 10 // for linux/windows handle `enter`
                || e.keyCode == 13  // for other handle `enter`
            )
        ) {
            prepareMessage.call($(this));
        }
    });
    
    
    // pre-set file-upload-modal hiden fields
    $('body').on('click', '.messages-body-wrap .file_btn, .files-actions-block .btn-darkblack', function (e) {
        var is_from_files = $(e.target).hasClass('btn-clip-msg') ? false : ($(e.target).hasClass('btn-darkblack') ? true : false);

        if (typeof ORDER == 'object') {
            if (ORDER.parent_id || ORDER.child_id) {
                $("#ModalFileAttachment .duplicate_order").show();
            } else {
                $("#ModalFileAttachment .duplicate_order").hide();
            }
        }

        var choose_recipient_select = $("#ModalFileAttachment #choose-recipient");
        var choose_file_type_select = $("#ModalFileAttachment #file-type");
        
//        choose_recipient_select.select2('destroy');
        if (choose_file_type_select.hasClass("select2-hidden-accessible")) {
            choose_file_type_select.select2('destroy');
        }
        
        var show_file_type = ($.inArray(parseInt(ORDER.status), [10, 12, 13, 15, 16]) >= 0 && typeof ORDER.confirmation_pending === 'undefined');
        
        /* START CHECK FILE-TYPE available */
        if (typeof ORDER == 'object' && show_file_type) {
            if ($.inArray(parseInt(ORDER.status), [15, 16]) >= 0) {
                choose_file_type_select.html('');
                $.each(
                    [
                        file_type_options.empty, 
                        file_type_options.materials, 
                        file_type_options.updates
                    ],
                    function (iter, option_data) {
                        var new_option = new Option(option_data.text, option_data.id, option_data.selected, option_data.selected);
                        choose_file_type_select.append(new_option);
                    }
                );
                choose_file_type_select.trigger('change');
                
//                choose_file_type_select.html(
//                        file_type_options.empty 
//                        + file_type_options.materials 
//                        + file_type_options.updates
//                );
                choose_file_type_select.select2({
                    minimumResultsForSearch: Infinity,
                    placeholder: "Select",
                    dropdownCssClass: 'single-filter-dropdown',
                    dropdownParent: choose_file_type_select.closest('.filter-single-inner')
                });
                
                is_from_files ? 
                    $("#ModalFileAttachment .file-type-msg").addClass('col-md-6') 
                    : $("#ModalFileAttachment .file-type-msg").removeClass('col-md-6');
                    
                $("#ModalFileAttachment .file-type-msg").show();
                
            } else if ($.inArray(parseInt(ORDER.status), [10, 12, 13]) >= 0) {
                choose_file_type_select.html('');
                $.each(
                    [
                        file_type_options.empty, 
                        file_type_options.final, 
                        file_type_options.draft,
                        file_type_options.materials
                    ],
                    function (iter, option_data) {
                        var new_option = new Option(option_data.text, option_data.id, option_data.selected, option_data.selected);
                        choose_file_type_select.append(new_option);
                    }
                );
                choose_file_type_select.trigger('change');
                
//                choose_file_type_select.html(
//                        file_type_options.empty 
//                        + file_type_options.final 
//                        + file_type_options.draft 
//                        + file_type_options.materials
//                );
                choose_file_type_select.select2({
                    minimumResultsForSearch: Infinity,
                    placeholder: "Select",
                    dropdownCssClass: 'single-filter-dropdown',
                    dropdownParent: choose_file_type_select.closest('.filter-single-inner')
                });
                
                is_from_files ? 
                    $("#ModalFileAttachment .file-type-msg").addClass('col-md-6') 
                    : $("#ModalFileAttachment .file-type-msg").removeClass('col-md-6');
                
                $("#ModalFileAttachment .file-type-msg").show();
            }
            
        } else {
            choose_file_type_select.html("");
            $("#ModalFileAttachment .file-type-msg").hide();
        }
        /* END CHECK FILE-TYPE available */
        
        /* START CHECK RECIPIENT available */
        if (!is_from_files) { // from messages
            (parseInt(currentTabId) === 1) ? $("#ModalFileAttachment [name='choose-recipient'] option[value='4']").prop("selected", true)
                    : $("#ModalFileAttachment [name='choose-recipient'] option[value='1']").prop("selected", true);
                    
            $("#ModalFileAttachment .chose-recipient-msg").removeClass('col-md-6');
            $("#ModalFileAttachment .chose-recipient-msg").hide();
            
            $("#ModalFileAttachment [name='order_id']").val($(this).attr('data-order'));
            $("#ModalFileAttachment [name='direction']").val($(this).attr('data-direction'));
            $("#ModalFileAttachment [name='recipient']").val($(this).attr('data-recipient'));
            
        } else { // from files
            $("#ModalFileAttachment [name='order_id']").val(ORDER.id);
            
            choose_recipient_select.val(null).trigger("change");
            
            show_file_type ? 
                $("#ModalFileAttachment .chose-recipient-msg").addClass('col-md-6')
                : $("#ModalFileAttachment .chose-recipient-msg").removeClass('col-md-6');
            
//            choose_recipient_select.select2();
            $("#ModalFileAttachment .chose-recipient-msg").show();
            
        }
        /* END CHECK RECIPIENT available */
        
    });
    
    // textarea resize
    var chatBoxHeight = calculateMessagesListHeight();
    var min_height =  $('#tab'+currentTabId+' .chat-wrapper .chat-textarea').outerHeight();
  
    
    $(document).on('input keypress', '.chat-textarea', function (e) {
        // define vars      
        var max_height = parseInt($(this).css('max-height'));

        var current_textarea_scroll_pane = currentTabId == 1 ? message_tabs_scroll.textareaBlocks.support : message_tabs_scroll.textareaBlocks.writer;
         if($(e.target).data('ticket-message')) {
            current_textarea_scroll_pane = $("[data-ticket-message]");
        }

        // set heights to zero
        $(this).css('height', 0 + 'px');
        $(this).closest('.chat-textarea').css('height', 0 + 'px');
        
        var scroll_position = current_textarea_scroll_pane.scrollTop();
        
        var height = $(this)[0].scrollHeight;
        
        // set height upd step
        var scroll_upd_px = 0;
        if(parseInt(height) > parseInt($(this).css('height'))){
            scroll_upd_px = 10;
        } else {
            scroll_upd_px = -10;
        }
        
        $(this).css('height', height);
        
        // check for add/hide scroll
        if (min_height >= height) {
            height = min_height;
            $(this).css('overflow-y', 'hidden');
        } else if(max_height > height) {
            $(this).css('overflow-y', 'hidden');
        } else if (max_height < height) {
            $(this).css('overflow-y', 'scroll');
            height = max_height;
        }
        
        // update message-holder height
        $(this).closest(".tab-content-msg").find('.messages-list-holder')
                .css('height', calculateMessagesListHeight() + 'px');
        $(this).css('height', height + 'px');
        $("#content-wrapper").animate({ scrollTop: $("#content-wrapper").height() }, 0);

        current_textarea_scroll_pane.animate({
            scrollTop: scroll_position + scroll_upd_px
        }, 0);
    });   
    
    $('.rate-support_msg [name="service_rate"]').on('click', function() {
        handleServiceRateClick.call(this);
    });
    
    $('.low-rate-support_msg .submit_btn').on('click', function() {
        handleServiceRateFeedbackAdd.call(this);
    });
    
    $('.low-rate-support_msg .cancel_btn').on('click', function() {
        $(this).closest('.msg-line').find('.set_rate-support_msg label').removeClass('selected');
        
        $(this).closest('.low-rate-support_msg').hide();
        $(this).closest('.msg-line').find('.set_rate-support_msg').show();
        
    });
    
    $('.low-rate-support_msg textarea[name="feedback_support"]').on('blur', function() {
        validateServiceRateComment.call(this);
    });

//    startUpdateMessagesCron();
    
    /*NEW MSGS RESPONSIVE*/
    if ($('[data-tab-item-messages]').length === 0) {
        return false;
    }
    $('[data-tab-item-messages]').click(function () {  
        $('.order-wrapper').addClass('msgs-new-holder');   
        $('.container-fluid[data-main-content]').addClass('container-fluid-msgs'); 
        $('#lottie-wrapper').hide();
    });
    $('[data-tab-item-files] , [data-tab-item-details]').click(function () {
        $(".order-wrapper").removeClass("msgs-new-holder"); 
        $('.container-fluid[data-main-content]').removeClass('container-fluid-msgs'); 
        $("#lottie-wrapper").show();
    });
    setTimeout(function () {
        $(".writers-list-inner .tabs .tab-link.current").click();
    }, 500);
    /*END NEW MSGS RESPONSIVE*/
});

/*Messages js END*/



/* Order-Details Files Tab Handlers */

$(document).ready(function(){
    
    $('body').on('click', '[data-tab-item-messages] , [data-tab-item-details]', function (e) {
        $(".order-wrapper").removeClass("files-new-holder"); 
        $(".order-title-wrapper").removeClass("files-title"); 
    });
    
    $('body').on('click', '[data-tab-item-files]', function (e) {
        $(".order-wrapper").addClass("files-new-holder"); 
        $(".order-title-wrapper").addClass("files-title"); 
    });
    
    /* START Files Filter Events Handling */
    $('body').on('select2:selecting', '#files-uploaded', function (e) {
        var prev_selected_list = $('#files-uploaded').select2('data');
        var current_selecting = e.params.args.data;
        
        if(prev_selected_list[0].id === '0') { // if changing from 'all'
            $('#files-uploaded').val(current_selecting.id).trigger('change');
            
        } else if (current_selecting.id === '0') {// if changing from any to 'all'
            $('#files-uploaded').val(current_selecting.id).trigger('change'); 
        }
        
    });
    $('body').on('select2:select', '#files-uploaded', function (e) {
        var selected_list = $('#files-uploaded').select2('data');
        var current_selecting = e.params.data;

        filterFilesView(selected_list);

        if ( // if all of types is selected
            selected_list.length === 3
            && $.inArray(current_selecting.id, ['1', '2', '3']) > -1
        ) {
            $('#files-uploaded').val('0').trigger('change');

            $('#files-uploaded').select2('close');
            $('#files-uploaded').select2('open');

            return false;
        }
        
    });
    
    $('body').on('select2:unselecting', '#files-uploaded', function (e) {
        var prev_selected_list = $('#files-uploaded').select2('data');
        var current_unselecting = e.params.args.data;
        
        if (current_unselecting.id === '0') {

            e.preventDefault();
        } else if (prev_selected_list.length === 1) {
            e.preventDefault();
//            $('#files-uploaded').val('0').trigger('change');
        }
    });
    
    $('body').on('select2:unselect', '#files-uploaded', function (e) {
        var selected_list = $('#files-uploaded').select2('data');
        
        filterFilesView(selected_list);
    });
    /* END Files Filter Events Handling */
    
    /* START Files Download Handling */
    $('body').on('click', '.files-list-box tbody tr .file-download .file-download-btn', function (e) {
        tryDownloadFile.call(this);
    });
    
    
    $('body').on('click', '.files-tab-wrapper .filters-files .download_all', function (e) {
        var files_containers = $(".files-list-box tbody tr:visible");
        
        if (files_containers.length === 0) { // has no files to download
            return false;  
        }
        
        var url_attach = "";
        $.each(
            files_containers,
            function(iter, file_container){
                url_attach += '&files[]='+$(file_container).attr('data-file-id');
                
                if ($(file_container).hasClass('file-read')) {
                    setTimeout(function () {
                        updateFileCounters();

                        $(file_container).removeClass("file-read");
                    }, 1000);
                }
            }
        );

        location.assign("https://" + window.location.hostname + "/files?subcom=multiDownload" + url_attach);
        
    });
    
    $("body").on('click', '.show_download [data-file-id]', function(e) {
        if($(e.target).hasClass('custom-checkbox')) {
             return false;
        }
        var file_wrap = $(this).closest('[data-file-id]');
        if(file_wrap.hasClass('checked')) {
            file_wrap.find('.custom-checkbox').removeClass('checked');
            file_wrap.removeClass('checked');
        } else {
            file_wrap.find('.custom-checkbox').addClass('checked');
            file_wrap.addClass('checked');
        }

        checkSelectedDownloadEnabled();
    })
    
    $('body').on('click', '.files-list-box tbody tr .checked-upload .custom-checkbox', function (e) {
        checkSelectedDownloadEnabled();
    });
    
    $('body').on('click', '.files-tab-wrapper .filters-files .download_selected', function (e) {
        if($(this).hasClass('btn-files-dissabled')) {
            alert('no_files_selected', 'Attention', 'Select the files you need to download');
            return false;  
        } else {
            var files_containers = $(".files-list-box tbody tr.checked");

            var url_attach = "";
                $.each(
                files_containers,
                function(iter, file_container){
                    url_attach += '&files[]='+$(file_container).attr('data-file-id');
                    if ($(file_container).hasClass('file-read')) {
                        setTimeout(function () {
                            updateFileCounters();

                            $(file_container).removeClass("file-read").removeClass("checked");
                            $(file_container).find('.custom-checkbox').removeClass("checked");
                            checkSelectedDownloadEnabled();
                        }, 1000);
                    }
                }
            );
    
            location.assign("https://" + window.location.hostname + "/files?subcom=multiDownload" + url_attach);   
        }
    });
    /* END Files Download Handling */
    
});

function checkSelectedDownloadEnabled() {
    setTimeout(function(){
        var available_files_count = $(".order-files .files-list-box .show_download tr:visible").length;
        
        if($(".files-list-box tbody tr .checked-upload .custom-checkbox.checked").length > 0 && available_files_count >= 1) {
            $(".files-tab-wrapper .filters-files .download_selected").removeClass('btn-files-dissabled');
        } else {
            $(".files-tab-wrapper .filters-files .download_selected").addClass('btn-files-dissabled');
        }
    }, 100);
}

function updateFileCounters() {
    
    var sidebar_orders_container = $("#accordionSidebar .nav-item-orders");
    
    if ($('.writers-list-inner [data-tab-item-files] .counter').length) {
        var count_unreaded = parseInt($('.writers-list-inner [data-tab-item-files] .counter').html());
        $('.writers-list-inner [data-tab-item-files] .counter').html(count_unreaded - 1);
        if (count_unreaded - 1 === 0) {
            var total_files_count = $(".order-files .files-list-box .show_download tr").length;
            $('.writers-list-inner [data-tab-item-files] .tab-item').html('Files ('+total_files_count+')');
        }
    }

    // sidebar -> my_orders -> counter
    if (parseInt(sidebar_orders_container.find('[data-summary_counter]').html()) > 0) {
        var prev_count_unreaded_summary_counter = parseInt(sidebar_orders_container.find('[data-summary_counter]').html());
        sidebar_orders_container.find('[data-summary_counter]').html(prev_count_unreaded_summary_counter - 1);

        if (prev_count_unreaded_summary_counter - 1 === 0) {
            sidebar_orders_container.find('[data-summary_counter]').hide();
        }
    }

    // sidebar -> my_orders -> current_order -> counter
    if (parseInt(sidebar_orders_container.find('[data-order-item][data-id="'+ORDER.id+'"] [data-counter]').html()) > 0) {
        var prev_count_unreaded_sidebar_order = parseInt(sidebar_orders_container.find('[data-order-item][data-id="'+ORDER.id+'"] [data-counter]').html());
        sidebar_orders_container.find('[data-order-item][data-id="'+ORDER.id+'"] [data-counter]').html(prev_count_unreaded_sidebar_order - 1);

        if (prev_count_unreaded_sidebar_order - 1 === 0) {
            sidebar_orders_container.find('[data-order-item][data-id="'+ORDER.id+'"] [data-counter]').hide();
        }
    }
}

function tryDownloadFile() {
    var container = $(this).closest("tr");
    var file_id = container.attr("data-file-id");
    
    window.open("https://" + window.location.hostname + "/files?ajax=get&file_id=" + file_id,'_blank');

    setTimeout(function () {
        if (container.hasClass('file-read')) {
            updateFileCounters();
                
            container.removeClass("file-read");
        }
    }, 1000);
}

function filterFilesView(selected_list) {
    
        $('.files-list-box tr').removeClass('checked');
        $('.files-list-box tr .custom-checkbox').removeClass('checked');
        $('.files-list-box tr').hide();
        
        $.each(
            selected_list,
            function(iter, selected_option) {
                if (selected_option.id === '0') {
                    $('.files-list-box tr').show();
                } else {
                    $('.files-list-box tr[data-sender-type="'+selected_option.id+'"]').show();
                }
            }
        );
        
        if(selected_list[0].id == 0) {
            var count_filtered = $('.files-list-box tbody tr').length;
        } else {
            var count_filtered = $('.files-list-box tbody tr:visible').length;
        }
     
        
        $('.files-numbers-count .counter-title').html(count_filtered + ' file' + ((count_filtered > 1 || count_filtered === 0) ? 's' : ''));
        if($('[data-filter="no-files"]').length === 1) {
            $('[data-filter="no-files"]').hide();
        }
        if (count_filtered === 0){
            $("#form-files .files-actions-block .download_all").addClass('btn-files-dissabled');
            
            if(selected_list[0].id != 0) {
                $('[data-filter="found-files]').hide();
                $('[data-filter="no-found-files"]').show();
            }           
        } else {
            $("#form-files .files-actions-block .download_all").removeClass('btn-files-dissabled');
            
            $('[data-filter="found-files]').show();
            $('[data-filter="no-found-files"]').hide();

        }
        
        checkSelectedDownloadEnabled();
}
var uploaded_files_list = {};

var file_item_template = false;
  
var modal_upload_scroll_pane = {
    block: false,
    api: false,
    max_height: 300
};

var file_upload_errors = {
    recipient: "Make sure to select recipient",
    file_type: "Make sure to select file type",
    recipient_and_file_type: "Make sure to select recipient and file type",
    attachment_failed: "1 or more attachments failed",
    attachment_empty: "Make sure to upload at least 1 attachment"
    
};

if (getWindowWidth <= 767){
    modal_upload_scroll_pane.max_height = 800;
}

function updateFileUploadModalHeight() {
    var real_height = $("#ModalFileAttachment .fileload-container .jspPane").innerHeight();
    
    if(real_height > modal_upload_scroll_pane.max_height) {
        $("#ModalFileAttachment .fileload-container").css('height', modal_upload_scroll_pane.max_height + "px");
    } else {
        $("#ModalFileAttachment .fileload-container").css('height', real_height + "px");
    }

    modal_upload_scroll_pane.api.reinitialise();
}

function removeTmpMessageFile() {
    var button = $(this),
        file_block = button.parent().closest('.fileload-item');

    delete uploaded_files_list[file_block.attr('data-file-temp-name')];
    
    file_block.slideUp(200, function(){
        $(this).detach();
        
        checkNotUploadedFiles();
        
        modal_upload_scroll_pane.api.reinitialise();
        
        updateFileUploadModalHeight();
        
        if($('.fileload-item').length == 0) {
            $("#ModalFileAttachment [data-submit-modal]")
                .addClass('submit_btn-disabled')
                .addClass('btn-disabled')
                .addClass('disabled-btn');
        }
    });
    
    
}

function checkNotUploadedFiles() {
    var error_uploaded_files = $("#ModalFileAttachment .fileload-container .error-files .fileload-item");
    $("#ModalFileAttachment .drop-files--extended__container").removeClass("error");
    
    if (error_uploaded_files.length > 0) {
        
        $("#ModalFileAttachment .modal-body > .attachment-error").show();
        $("#ModalFileAttachment [data-submit-modal]")
                .addClass('submit_btn-disabled')
                .addClass('btn-disabled')
                .addClass('disabled-btn');
    } else {
        $("#ModalFileAttachment .modal-body > .attachment-error").hide();
        $("#ModalFileAttachment [data-submit-modal]")
                .removeClass('submit_btn-disabled')
                .removeClass('btn-disabled')
                .removeClass('disabled-btn');
    }
}

function preloadFiles(pre_files){
    if(pre_files.length){
        var parsed_html_data = {
            error_block: "",
            valid_block: ""
        };
        
        $.each(
            pre_files,
            function(iter, file_data){
                
                var file_name = file_data.name,
                    file_name_transl = rus_to_latin(file_name),
                    tmp_file_name = Date.now()+'---'+Base64.encode(file_name_transl);
 
                var valid_ext = checkFileExtension(file_name);
  
                file_data.name = file_name_transl;
                file_data.interval = false;
                if(MAX_FILESIZE > file_data.size && valid_ext) {
                    uploaded_files_list[tmp_file_name] = file_data;
                }
                
                var validation_errors = {
                   file_size_error :  MAX_FILESIZE < file_data.size ? 'File size exceeds 100 Mb. Contact support team for help.' : false,
                   extension_error : valid_ext ? false : 'Wrong file format. Use ZIP.' 
                };

                var file_size_data = parseBytes(file_data.size);

                var current_html = message_templates.file_upload_item.fetch({
                    in_development: in_development,
                    file_data_tmp_name: tmp_file_name,
                    file_data: {
                        name: file_name_transl,
                        cropped_name: croppString(file_name_transl, 25, 7),
                        size: file_size_data.size + " " + file_size_data.size_type
                    },
                    validation_error: validation_errors.file_size_error ? 
                                        validation_errors.file_size_error 
                                        : (
                                            validation_errors.extension_error ?  
                                            validation_errors.extension_error 
                                            : false
                                        )
                });   

                if (MAX_FILESIZE < file_data.size || !valid_ext) {
                    parsed_html_data.error_block += current_html;
                } else {
                    parsed_html_data.valid_block += current_html;
                }
                

//                if(MAX_FILESIZE < file_data.size) {
//                    error_files++;
//                }
            }
        );

        
        $("#ModalFileAttachment .fileload-container .jspPane .error-files").append(parsed_html_data.error_block);
        $("#ModalFileAttachment .fileload-container .jspPane .valid-files").append(parsed_html_data.valid_block);
        
        
        checkNotUploadedFiles();
        
        $.each(
            $("#ModalFileAttachment .fileload-container .to-handle-events"),
            function(iter, file_block){
                $(file_block).find('.select-file-type select').select2({
                    placeholder: "File Type",
                    //dropdownParent: $(this).closest('.fileload-item').find('.select-file-type'),
                    minimumResultsForSearch: -1,
                    containerCssClass: 'custom-select-wrapper',
                    dropdownCssClass: 'custom-select-wrapper'       
                });

                $(file_block).removeClass('to-handle-events');
            }
        );


        modal_upload_scroll_pane.api.reinitialise();
        
        if(modal_upload_scroll_pane.api.getContentHeight() > modal_upload_scroll_pane.max_height) {
            $("#ModalFileAttachment .fileload-container").css('height', modal_upload_scroll_pane.max_height + "px");
        } else {
            $("#ModalFileAttachment .fileload-container").css('height', modal_upload_scroll_pane.api.getContentHeight() + "px");
        }
        
        modal_upload_scroll_pane.api.reinitialise();

        $("#ModalFileAttachment #files_input").val('');
    }
}
function preventDefaults (e) {
  e.preventDefault();
  e.stopPropagation();
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    var files_list = e.dataTransfer.files;

    preloadFiles(files_list);
    return false;
}

var files_left_to_upload = 0,
    file_upload_interval = false;
    
$(document).ready(function(){
    if($("#file_list_item").length) {
        file_item_template = new jSmart($("#file_list_item")[0].innerHTML);
    }
    
    $("#ModalFileAttachment").on("show.bs.modal", function(){
        $("#ModalFileAttachment .modal-body > .attachment-error").hide();
        modal_upload_scroll_pane.block = $("#ModalFileAttachment .fileload-container").jScrollPane();
        modal_upload_scroll_pane.api = modal_upload_scroll_pane.block.data('jsp');
        
    });
    
    $("#ModalFileAttachment").on("shown.bs.modal", function(){
        updateFileUploadModalHeight();
    });
    
    $("#ModalFileAttachment").on("hide.bs.modal", function(){
        uploaded_files_list = {};
        
        $("#ModalFileAttachment .fileload-container .jspPane .error-files").html("");
        $("#ModalFileAttachment .fileload-container .jspPane .valid-files").html("");
        
        $("#ModalFileAttachment .drop-files--extended__container").removeClass("error");
        $("#ModalFileAttachment .attachment-error").slideUp(200);
        
        
        $("#ModalFileAttachment #choose-recipient").removeClass("error");
        $("#ModalFileAttachment #file-type").removeClass("error");
        
        $("#ModalFileAttachment .recipient-or-file-type-error").slideUp(200);
        
        modal_upload_scroll_pane.api.reinitialise();
    });
    
    var dropZone = $('#ModalFileAttachment .modal-body .drop-files--extended__container')[0];
    dropZone.addEventListener('dragover', preventDefaults, false);
    dropZone.addEventListener('drop', preventDefaults, false);

    dropZone.addEventListener(
            'dragover', 
            function(e){ /*console.log("DragOver");*/ },
            false);


    dropZone.addEventListener(
            'drop', 
            handleDrop,
            false);
    
    $("#ModalFileAttachment #files_input").on('change', function(){
        preloadFiles($(this)[0].files);
    });
    
    $("#ModalFileAttachment [data-submit-modal]").on('click', function(){
        var recipient_and_type = validateFilesRecipientAndType();
        var files_valid = true;
        
        if (file_upload_interval !== false) {
            clearInterval(file_upload_interval);
            file_upload_interval = false;
        } else {
            files_valid = validateFilesUploaded();
        }
        
        
        $(this).attr('disabled', true);
        
        files_left_to_upload = 0;
        
        if (recipient_and_type.has_error || !files_valid) {
            event.preventDefault();
            event.stopPropagation();
            $(this).removeAttr('disabled');
            return false;
        }
        /* END Validation */
        
        
        $.each(
            uploaded_files_list,
            function(file_tmp_name, file_data){
                tryFileUpload(file_tmp_name, file_data);
            }
        );

        file_upload_interval = setInterval(function(){
            if (parseInt($("#ModalFileAttachment [data-submit-modal]").attr('data-lost-connection')) > 0 && window.navigator.onLine) {
                $("#ModalFileAttachment [data-submit-modal]").removeAttr('data-lost-connection');
                $("#ModalFileAttachment [data-submit-modal]").removeAttr('disabled');
            } else if (!window.navigator.onLine) {
                $("#ModalFileAttachment [data-submit-modal]").attr('data-lost-connection', '1');
                $("#ModalFileAttachment [data-submit-modal]").attr('disabled', 'disabled');
            }
            
            if(files_left_to_upload === 0){
                setTimeout(function(){
                    $('.files-tab-wrapper [data-filter="no-files"]').hide();
                    $('.files-tab-wrapper [data-filter="no-found-files"]').hide();
                    $('.files-tab-wrapper [data-filter="found-files]').show();

                    if($('#files-uploaded').select2('data')[0].id !== '0') { // if changing from 'all'
                        $('#files-uploaded').val('0').trigger('change');
                    }

                    filterFilesView([{id:'0'}]);
                    
                    $("#ModalFileAttachment input[type='file']").val('');
                    $("#ModalFileAttachment .fileload-item").detach();
                    $("#ModalFileAttachment [data-submit-modal]").removeAttr('disabled');

                    $("#ModalFileAttachment").modal('hide');
                    
                    console.log('m 1', $("#ModalFileAttachment [name='file-type']").val());
                    if ($("#ModalFileAttachment [name='file-type']").val() == 'final') {
                        console.log('m 2', location.href);
                        redirect(location.href);
                    }
                    console.log('m 3');

                    uploaded_files_list = {};
                }, 1000);
                
                clearInterval(file_upload_interval);
                file_upload_interval = false;
            }
        }, 100);
        
    });
    
    $("#ModalFileAttachment #choose-recipient, #ModalFileAttachment #file-type").on('select2:select', function (e) {
        validateFilesRecipientAndType();
    });
});

function validateFilesRecipientAndType() {
    var fields_required = {
        recipient: $("#ModalFileAttachment #choose-recipient").is(':visible'),
        file_type: $("#ModalFileAttachment #file-type").is(':visible')
    };
    
    var validation_res = {
        has_error: false,
        data: {
            direction: false,
            file_type: false
        }
    };

    if (fields_required.recipient) {
        validation_res.data.direction = $("#ModalFileAttachment #choose-recipient").select2('data')[0].id;
    } else {
        validation_res.data.direction = $('.tab-content-msg.current').find('[data-target="#ModalFileAttachment"]').attr('data-direction');
    }

    if (fields_required.file_type) {
        validation_res.data.file_type = $("#ModalFileAttachment #file-type").select2('data')[0].id;
    }

    /* START Validation */
    var recipient_valid = (!fields_required.recipient || (validation_res.data.direction !== false && $.inArray(validation_res.data.direction, ['1', '4']) >= 0));
    var file_type_valid = (!fields_required.file_type || (validation_res.data.file_type !== false && $.inArray(validation_res.data.file_type, ['final', 'draft', 'materials', 'updates']) >= 0));


    $("#ModalFileAttachment #choose-recipient").removeClass("error");
    $("#ModalFileAttachment #file-type").removeClass("error");

    if (recipient_valid && file_type_valid) { // all is good
        $("#ModalFileAttachment .recipient-or-file-type-error").hide();

    } else if (!recipient_valid && !file_type_valid) { // if recipient & file_type are not valid
        $("#ModalFileAttachment #choose-recipient").addClass("error");
        $("#ModalFileAttachment #file-type").addClass("error");

        $("#ModalFileAttachment .recipient-or-file-type-error .modal-error-block").html(file_upload_errors.recipient_and_file_type);
        $("#ModalFileAttachment .recipient-or-file-type-error").show();

        validation_res.has_error = true;

    } else if (!recipient_valid) { // if recipient is not valid
        $("#ModalFileAttachment #choose-recipient").addClass("error");

        $("#ModalFileAttachment .recipient-or-file-type-error .modal-error-block").html(file_upload_errors.recipient);
        $("#ModalFileAttachment .recipient-or-file-type-error").show();

        validation_res.has_error = true;

    } else if (!file_type_valid) { // if file_type is not valid
        $("#ModalFileAttachment #file-type").addClass("error");

        $("#ModalFileAttachment .recipient-or-file-type-error .modal-error-block").html(file_upload_errors.file_type);
        $("#ModalFileAttachment .recipient-or-file-type-error").show();

        validation_res.has_error = true;
    }
    
    return validation_res;
    /* END Validation */
}

function validateFilesUploaded() {
    var attachment_valid = (Object.keys(uploaded_files_list).length > 0 && $("#ModalFileAttachment .error-files .fileload-item.fileload-item-error").length === 0);

    var files_valid = false;

    // check if files choosen
    if (attachment_valid) {
        $("#ModalFileAttachment .drop-files--extended__container").removeClass("error");
        $("#ModalFileAttachment .fileload-item").removeClass('fileload-item-error');
        $("#ModalFileAttachment .fileload-item .retry-block").hide();
        
        $("#ModalFileAttachment .attachment-error").attr('style', "display: none !important;");
        files_valid = true;

    } else {
        $("#ModalFileAttachment .drop-files--extended__container").addClass("error");
        $("#ModalFileAttachment .attachment-error").html(uploaded_files_list.length === 0 ? file_upload_errors.attachment_empty : file_upload_errors.attachment_failed);
        $("#ModalFileAttachment .attachment-error").removeAttr('style');
    }
    
    return files_valid;
}

//var jspFileTimeout = false;

function fileUploadLostedConnection(file_tmp_name) {
    var file_block = $("#ModalFileAttachment .fileload-container .fileload-item[data-file-temp-name='"+file_tmp_name+"']");
    var error_text = 'Upload failure (no connection).';


    file_block.addClass('fileload-item-error');
    file_block.find('.file_load_progress').hide();

    file_block.find('.retry-block').show();
    file_block.find('.file-load-cancel').show();
    file_block.find('.attachment-error').html(error_text).removeAttr('style');
    file_block.find('.file_caption-inner').after('<div class="attacht-fail attachment-error d-none d-md-block">Upload failure (no connection).</div>');
    
    updateFileUploadModalHeight();
}

function updateFileUploadProcess(file_tmp_name) {
    var is_online = window.navigator.onLine;
    
    if (!is_online) {
        clearInterval(uploaded_files_list[file_tmp_name].interval);
        fileUploadLostedConnection(file_tmp_name);
        
        return false;
    }
    
    var file_block = $("#ModalFileAttachment .fileload-item[data-file-temp-name='"+file_tmp_name+"']");
    var current_status = parseInt(file_block.find('.file_load_progress').attr('aria-valuenow'));
    
    // calculate what part of file can be uploaded in 1/20 of second
    var step_for_progress =  1/(uploaded_files_list[file_tmp_name].size / (internet_speed.value.bytes/20 /* speed for 1/20 sec */));
    
    // if (step_for_progress > 1) -> file will be uploaded faster than 1/20 sec
    if (step_for_progress > 1) {
        file_block.find('.file_load_progress').attr('aria-valuenow', '100')
                .find('.progress-bar').css('width', '100%');
    } else {
        var new_status = current_status + (step_for_progress*100);
        
        new_status = new_status > 100 ? 100 : new_status;
        
        file_block.find('.file_load_progress').attr('aria-valuenow', new_status)
                .find('.progress-bar').css('width', new_status+'%');
        
    }
}

function tryFileUpload(file_tmp_name, file_data) {
    var order_id = $("#ModalFileAttachment [name='order_id']").val();
    
    var recipient_and_type = validateFilesRecipientAndType();
    
    var files_valid = true;
    if (file_upload_interval === false) {
        files_valid = validateFilesUploaded();
    }

    if (recipient_and_type.has_error || !files_valid) {
        event.preventDefault();
        event.stopPropagation();
        $(this).removeAttr('disabled');
        return false;
    }
    
    var form_data = false;
    form_data = new FormData();

    form_data.append('order_id', order_id);
    form_data.append('direction', recipient_and_type.data.direction);

    if(recipient_and_type.data.file_type !== ""){
        if (recipient_and_type.data.file_type === 'final') {
            form_data.append('final', 1);
            form_data.append('draft', 0);
            form_data.append('materials', 0);
            form_data.append('updates', 0);

        } else if (recipient_and_type.data.file_type === 'draft') {
            form_data.append('final', 0);
            form_data.append('draft', 1);
            form_data.append('materials', 0);
            form_data.append('updates', 0);

        } else if (recipient_and_type.data.file_type === 'materials') {
            form_data.append('final', 0);
            form_data.append('draft', 0);
            form_data.append('materials', 1);
            form_data.append('updates', 0);

        } else if (recipient_and_type.data.file_type === 'updates') {
            form_data.append('final', 0);
            form_data.append('draft', 0);
            form_data.append('materials', 0);
            form_data.append('updates', 1);

        }

    }

    var file_block = $("#ModalFileAttachment .fileload-item[data-file-temp-name='"+file_tmp_name+"']");

    form_data.append('file_tmp_name', file_tmp_name);
    form_data.append('files[]', file_data);

    files_left_to_upload++;

    file_block.find('.file-load-cancel, .file_load_size').hide();
    file_block.find('.file_load_progress').show();

    updateFileUploadModalHeight();
    
    uploaded_files_list[file_tmp_name].interval = setInterval(updateFileUploadProcess, 50, file_tmp_name); // 1/20 part of secont

    $.ajax({
        url: 'messages?ajax=attachFile', // point to server-side PHP script
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        method: 'POST',
        type: 'POST',
        success: function (data) {

            var upload_result = JSON.parse(data).upload_result;
//                        if (!is_from_files){
//                            addMessage(upload_result.message_text, $("#tab"+ (parseInt(direction) == 6 ? 1 : 2)+ " .messages-body-wrap"), upload_result.file_id, true);
//
//                            var file_data = uploaded_files_list[upload_result.file_tmp_name];
//                            appendWriterFile({
//                                id: upload_result.file_id,
//                                name: file_data.name,
//                                creation_date: Math.floor(Date.now() / 1000),
//                                comment: upload_result.comment,
//                                size_k: parseFloat(file_data.size / 1000).toFixed(2)
//                            });
//                            
//                            $(".tab-user-files .files-list-item[file-id='"+upload_result.file_id+"'] .delete-file-btn").on('click', function(e){
//                                preDeleteFile($(this), e);
//                            });
//                        } else {
            addMessage(upload_result.message_text, $("#tab" + (parseInt(recipient_and_type.data.direction) == 4 ? 1 : 2) +  " .messages-body-wrap"), upload_result.file_id, true);

            var file_data = uploaded_files_list[upload_result.file_tmp_name];
            appendWriterFile({
                id: upload_result.file_id,
                owner_id: CURRENT_USER.id,
                name: file_data.name,
                creation_date: Math.floor(Date.now() / 1000),
                approved_for_writer: Math.floor(Date.now() / 1000),
                final: upload_result.final,
                draft: upload_result.draft,
                materials: upload_result.materials,
                updates: upload_result.updates,
                comment: ''
            });

            $(".order-files .files-list-box tr[data-file-id='"+upload_result.file_id+"'] .checked-upload .custom-checkbox").on('click', function(e){
                if(this.classList.contains('checked')){
                    this.classList.remove('checked');
                    this.closest("tr").classList.remove('checked');
                }else{
                    this.classList.add('checked');
                    this.closest("tr").classList.add('checked');
                }

                checkSelectedDownloadEnabled();
            });

            $(".files-list-box tbody tr[data-file-id='"+upload_result.file_id+"'] .file-download .file-download-btn").on('click', function(){
                tryDownloadFile.call(this);
            });

            clearInterval(uploaded_files_list[upload_result.file_tmp_name].interval);
            uploaded_files_list[upload_result.file_tmp_name].interval = false;

            file_block.find('.file_load_progress').hide();
            file_block.find('.upload-done-icon, .file_load_size').show();
            
            files_left_to_upload--;
            

            delete uploaded_files_list[upload_result.file_tmp_name];
        },
        error: function (data) {
            // TODO
        }
    });
}

function retryFileUpload() {
    if (window.navigator.onLine === false) {
        return false;
    }
    
    var file_block = $(this).parent().closest('.fileload-item');
    
    var file_tmp_name = file_block.attr('data-file-temp-name');
    var file_data = uploaded_files_list[file_tmp_name];
    
    
    file_block.removeClass('fileload-item-error');
    file_block.find('.file_load_progress').show();
    
    file_block.find('.retry-block').attr('style', "display: none !important;");
    file_block.find('.attachment-error').attr('style', "display: none !important;");
    
    files_left_to_upload--;
    tryFileUpload(file_tmp_name, file_data);
}

function appendWriterFile(file_data, read){
    var parsed_file_html = file_item_template.fetch({
        ajax_parsing: true,
        current_user: CURRENT_USER,
        file: file_data,
        noreadhandler: read ? false : true
    });
    
    var current_files_count = $(".order-files .files-list-box tbody tr").length;
//    $(".files-tabs-holder #tab_2 .files-list-header .files_quantity").html(current_files_count + " file" + (current_files_count > 1 ? "s" : ""));
    
    if(current_files_count > 0) {
        $(".order-files .files-list-box tbody").prepend(parsed_file_html);
        
    } else {
        $(".order-files .preview-wrap-files[data-filter='no-files']").fadeOut(200, function () {
            $(".order-files .files-list-box tbody").prepend(parsed_file_html);
            $(".order-files .files-list-box").fadeIn(200);
        });
    }
}

function preDeleteFile(file_block, e) {
    e.preventDefault();
    e.stopPropagation();
    var file_id = file_block.closest('tr').attr("file-id");
    var order_id = file_block.closest('tr').attr("order-id");
    var client_id = file_block.closest('tr').attr("client-id");
    if (parseInt(file_id)) {
        $('#ModalFileDelete').find('input[name="file_id"]').val(file_id);
        $('#ModalFileDelete').find('input[name="order_id"]').val(order_id);
        $('#ModalFileDelete').find('input[name="client_id"]').val(client_id);
        $('#ModalFileDelete').modal('show');
    }
}

function checkFileExtension(file_name, custom_extentions) {
    var custom_extentions = custom_extentions || false
    var parts = file_name.split('.');
    if (parts.length > 1) {
        var ext = parts.pop().toLowerCase();
        if (custom_extentions) {
            return !!($.inArray(ext, custom_extentions) + 1);
        } else {
            return !!($.inArray(ext, AVAILABLE_EXTENTIONS) + 1);
        }
    }
    return false;
}
/* Clamp.js 0.5.1 */
(function(){window.$clamp=function(c,d){function s(a,b){n.getComputedStyle||(n.getComputedStyle=function(a,b){this.el=a;this.getPropertyValue=function(b){var c=/(\-([a-z]){1})/g;"float"==b&&(b="styleFloat");c.test(b)&&(b=b.replace(c,function(a,b,c){return c.toUpperCase()}));return a.currentStyle&&a.currentStyle[b]?a.currentStyle[b]:null};return this});return n.getComputedStyle(a,null).getPropertyValue(b)}function t(a){a=a||c.clientHeight;var b=u(c);return Math.max(Math.floor(a/b),0)}function x(a){return u(c)*
a}function u(a){var b=s(a,"line-height");"normal"==b&&(b=1.2*parseInt(s(a,"font-size")));return parseInt(b)}function l(a){if(a.lastChild.children&&0<a.lastChild.children.length)return l(Array.prototype.slice.call(a.children).pop());if(a.lastChild&&a.lastChild.nodeValue&&""!=a.lastChild.nodeValue&&a.lastChild.nodeValue!=b.truncationChar)return a.lastChild;a.lastChild.parentNode.removeChild(a.lastChild);return l(c)}function p(a,d){if(d){var e=a.nodeValue.replace(b.truncationChar,"");f||(h=0<k.length?
k.shift():"",f=e.split(h));1<f.length?(q=f.pop(),r(a,f.join(h))):f=null;m&&(a.nodeValue=a.nodeValue.replace(b.truncationChar,""),c.innerHTML=a.nodeValue+" "+m.innerHTML+b.truncationChar);if(f){if(c.clientHeight<=d)if(0<=k.length&&""!=h)r(a,f.join(h)+h+q),f=null;else return c.innerHTML}else""==h&&(r(a,""),a=l(c),k=b.splitOnChars.slice(0),h=k[0],q=f=null);if(b.animate)setTimeout(function(){p(a,d)},!0===b.animate?10:b.animate);else return p(a,d)}}function r(a,c){a.nodeValue=c+b.truncationChar}d=d||{};
var n=window,b={clamp:d.clamp||2,useNativeClamp:"undefined"!=typeof d.useNativeClamp?d.useNativeClamp:!0,splitOnChars:d.splitOnChars||[".","-","\u2013","\u2014"," "],animate:d.animate||!1,truncationChar:d.truncationChar||"\u2026",truncationHTML:d.truncationHTML},e=c.style,y=c.innerHTML,z="undefined"!=typeof c.style.webkitLineClamp,g=b.clamp,v=g.indexOf&&(-1<g.indexOf("px")||-1<g.indexOf("em")),m;b.truncationHTML&&(m=document.createElement("span"),m.innerHTML=b.truncationHTML);var k=b.splitOnChars.slice(0),
h=k[0],f,q;"auto"==g?g=t():v&&(g=t(parseInt(g)));var w;z&&b.useNativeClamp?(e.overflow="hidden",e.textOverflow="ellipsis",e.webkitBoxOrient="vertical",e.display="-webkit-box",e.webkitLineClamp=g,v&&(e.height=b.clamp+"px")):(e=x(g),e<=c.clientHeight&&(w=p(l(c),e)));return{original:y,clamped:w}}})();

function newsRead(news_id) {
    $("#news-"+news_id)
            .removeClass("item-unread")
            .find(".read_button").hide();  
    
    $("#news-"+news_id).find('.message-body-unread__previev').hide();
    $("#news-"+news_id).find('.message-body-unread').show();
    
    if ($("#news-"+news_id).parents("#content").find(".item-unread").length == 0) {
        $("#news-"+news_id).parents("#content").find(".alert-info").remove();
    }
    
    var count_news = parseInt($("#accordionSidebar [data-count-news]").html()) - 1;
    
    updateNewsCounter(count_news);
    
    
    callAjax(
        "json", 
        "/news?ajax=read&news_id="+news_id, 
        function(data) {
            if (data.news_read === 'ok') {}
        }
    );
}

$(".orders-wrapper .news-item .three-lines").truncate({
    lines: 3
});

//cutText(3);
function cutText(line){
    var news = document.querySelectorAll('.message-body-unread');
    var preview = document.querySelectorAll('.message-body-unread__previev');
    var btn = document.querySelectorAll('.btn-button');

    preview.forEach(function (item, i, massive) {   
        if (typeof window.orientation !== 'undefined') {
            $clamp(preview[i], {clamp: line+2, useNativeClamp: false});
        }else{
            $clamp(preview[i], {clamp: line, useNativeClamp: false});
        }                
    });   

    btn.forEach(function (item, j, massive) {   
        item.addEventListener('click', function(){
            this.previousElementSibling.previousElementSibling.classList.add("d-none");
            this.previousElementSibling.classList.add("d-block");
            this.closest(".news-item").classList.add("item-read");
            this.remove();
        });
    });           
}
/* Tickets js START*/

var limit_from_ticket = 0;
var append_ticket_list = false;
var ticket_create = {
    subject: {
        is_settings_ticket: false,
        validate: function (on_input/* from .on('input')*/) {
                        var subj_field = $(this);
                        var subj_val = subj_field.val();

                        if (subj_val.length === 0) {
                            clearTimeout(ticket_create.subject.timeout);
                            
                            ticket_create.subject.timeout = setTimeout(function(){
                                subj_field.addClass('error')
                                        .parent().closest('.field-block')
                                            .find('.alert-required')
                                                .html(ticket_create.subject.errors.empty)
                                                .slideDown(200);

                                subj_field.parent().closest('#ModalCreateTicket')
                                            .find('[data-submit-modal]').addClass('submit_btn-disabled');
                            }, on_input ? 500 : 10);

                            return false;

                        } else if (checkForLatin(subj_val) === false) {
                            clearTimeout(ticket_create.subject.timeout);
                            
                            ticket_create.subject.timeout = setTimeout(function(){
                                subj_field.addClass('error')
                                        .parent().closest('.field-block')
                                            .find('.alert-required')
                                                .html(ticket_create.subject.errors.not_latin)
                                                .slideDown(200);

                                subj_field.parent().closest('#ModalCreateTicket')
                                            .find('[data-submit-modal]').addClass('submit_btn-disabled');
                            }, on_input ? 500 : 10);

                            return false;

                        } else if (!on_input && subj_val.split(' ').length > 100) {
                            clearTimeout(ticket_create.subject.timeout);
                            
                            ticket_create.subject.timeout = setTimeout(function(){
                                subj_field.addClass('error')
                                        .parent().closest('.field-block')
                                            .find('.alert-required')
                                                .html(ticket_create.subject.errors.max_words)
                                                .slideDown(200);

                                subj_field.parent().closest('#ModalCreateTicket')
                                            .find('[data-submit-modal]').removeClass('submit_btn-disabled');
                            }, 1);

                            return false;
                        } else {
                            clearTimeout(ticket_create.subject.timeout);
                            
                            ticket_create.subject.timeout = setTimeout(function(){
                                subj_field.removeClass('error')
                                        .parent().closest('.field-block')
                                            .find('.alert-required')
                                                .slideUp(200);

                                subj_field.parent().closest('#ModalCreateTicket')
                                            .find('[data-submit-modal]').removeClass('submit_btn-disabled');

                            }, on_input ? 500 : 10);
                            return true;
                        }
        },
        errors: {
            empty: 'This field cannot be empty',
            not_latin: 'Please use latin characters only',
            max_words: 'Please enter no more than 100 words here'
        },
        timeout: false
    },
    message: {
        validate: function (on_input/* from .on('input')*/) {
                        var mess_field = $(this);
                        var mess_val = mess_field.val();

                        if (mess_val.length === 0) {
                            clearTimeout(ticket_create.message.timeout);
                            
                            ticket_create.message.timeout = setTimeout(function(){
                                mess_field.addClass('error')
                                        .parent().closest('.field-block')
                                            .find('.alert-required')
                                                .html(ticket_create.message.errors.empty)
                                                .show();

                                mess_field.parent().closest('#ModalCreateTicket')
                                            .find('[data-submit-modal]').addClass('submit_btn-disabled');
                            }, on_input ? 500 : 10);
                            
                            return false;

                        } else if (checkForLatin(mess_val) === false) {
                            clearTimeout(ticket_create.message.timeout);
                            
                            ticket_create.message.timeout = setTimeout(function(){
                                mess_field.addClass('error')
                                        .parent().closest('.field-block')
                                            .find('.alert-required')
                                                .html(ticket_create.message.errors.not_latin)
                                                .show();

                                mess_field.parent().closest('#ModalCreateTicket')
                                            .find('[data-submit-modal]').addClass('submit_btn-disabled');
                            }, on_input ? 500 : 10);
                            
                            return false;

                        } else {
                            clearTimeout(ticket_create.message.timeout);
                            
                            ticket_create.message.timeout = setTimeout(function(){
                                mess_field.removeClass('error')
                                        .parent().closest('.field-block')
                                            .find('.alert-required')
                                                .hide();

                                mess_field.parent().closest('#ModalCreateTicket')
                                        .find('[data-submit-modal]').removeClass('submit_btn-disabled');
                            }, on_input ? 500 : 10);
                            
                            return true;
                        }
        },
        errors: {
            empty: 'This field cannot be empty',
            not_latin: 'Please use latin characters only'
        },
        timeout: false
    },
    templates: {
        ticket_item: false
    },
    initialize: function () {
        var $button = $(this);
        var $modal = $("#ModalCreateTicket");
        
        $modal.find('[name="new-ticket-subject"]').removeClass('error').parent().find('.alert-required').hide();
        $modal.find('[name="new-ticket-textarea"]').removeClass('error').parent().find('.alert-required').hide();
        
        if (ticket_create.is_settings_ticket) {
            $('.modal').modal('hide');//hide all modal before
            $modal.find('#ModalCreateTicketTitle').html('Request change');
            $modal.find('.alert-info').show();
            $modal.find('[name="new-ticket-category"]').find('option').prop('selected', null);
            $modal.find('[name="new-ticket-category"]').find('option[value="' + $button.attr("data-new-ticket-category") + '"]').prop('selected', true);
            $modal.find('[name="new-ticket-category"]').change().closest('.field-block').hide();
        } else {
            $modal.find('#ModalCreateTicketTitle').html('Create new ticket');            
            $modal.find('.alert-info').hide();
            $modal.find('[name="new-ticket-category"]').find('option[value="' + 1 + '"]').prop('selected', true);
            $modal.find('[name="new-ticket-category"]').change().closest('.field-block').show();
        }
        $modal.modal('show');
    },        
    clear_modal: function(with_close) {
        var create_ticket_modal = $("#ModalCreateTicket");
        
        if (with_close) {
            create_ticket_modal.modal('hide');
        }
        
        create_ticket_modal.find("#new-ticket-category").val('1').trigger('change');
        
        create_ticket_modal.find("input[name='new-ticket-subject']").val('').removeClass('error')
                                        .parent().closest('.field-block')
                                            .find('.alert-required')
                                                .hide();

            
        create_ticket_modal.find("textarea[name='new-ticket-textarea']").val('').removeClass('error')
                .parent().closest('.field-block')
                    .find('.alert-required')
                        .hide();

        create_ticket_modal.find('[data-submit-modal]').addClass('submit_btn-disabled');
        
        enableButton.call(create_ticket_modal.find('[data-submit-modal]'));
        
    },
    modal_upload_scroll_pane: {
        block: false,
        api: false,
        max_height: 300
    },
    uploaded_files_list: {},
    uploaded_files_ids: {},
    uploaded_files_messages_names: {},
    uploaded_files_after_reload: {},
    files_left_to_upload: 0,
    file_upload_interval: false,
    success_upload: true,
    parent_target: "#ModalCreateTicket",
    files_retry_preload: {},
    preloadFiles: function (pre_files, fromReload, from_messages) {
        if(pre_files.length){
            var parsed_html_data = {
                error_block: "",
                valid_block: ""
            };

            $.each(
                pre_files,
                function(iter, file_data){

                    var file_name = file_data.name,
                        file_name_transl = rus_to_latin(file_name),
                        tmp_file_name = Date.now()+'---'+Base64.encode(file_name_transl);

                    var valid_ext = checkFileExtension(file_name);

                    file_data.name = file_name_transl;
                    file_data.interval = false;
                    if(MAX_FILESIZE > file_data.size && valid_ext) {
                        ticket_create.uploaded_files_list[tmp_file_name] = file_data;
                        ticket_create.uploaded_files_messages_names[tmp_file_name] = {};
                        ticket_create.uploaded_files_ids[tmp_file_name] = {
                            name: file_data.name
                        };
                        if(fromReload) {
                            ticket_create.uploaded_files_after_reload[tmp_file_name] = file_data;
                        }
                    }

                    var validation_errors = {
                       file_size_error :  MAX_FILESIZE < file_data.size ? 'File size exceeds 50 Mb' : false,
                       extension_error : valid_ext ? false : 'Wrong file format. Use ZIP.' ,
                       offline_handler : navigator.onLine ? false : 'Upload failure (no connection)'
                    };

                    var file_size_data = parseBytes(file_data.size);

                    var current_html = message_templates.file_upload_item.fetch({
                        in_development: in_development,
                        file_data_tmp_name: tmp_file_name,
                        file_data: {
                            name: file_name_transl,
                            cropped_name: croppString(file_name_transl, 25, 7),
                            size: file_size_data.size + " " + file_size_data.size_type
                        },
                        validation_error: validation_errors.file_size_error ? 
                                            validation_errors.file_size_error 
                                            : (
                                                validation_errors.extension_error ?  
                                                validation_errors.extension_error 
                                                : (
                                                    validation_errors.offline_handler ? 
                                                    validation_errors.offline_handler : false)
                                                        )
                                            ,
                        remove_file_fnc_name: "ticket_create.removeTmpFile",
                        retry_file_btn: !navigator.onLine ? true : false
                    });   

                    if (MAX_FILESIZE < file_data.size || !valid_ext || !navigator.onLine) {
                        parsed_html_data.error_block += current_html;
                    } else {
                        parsed_html_data.valid_block += current_html;
                    }
                }
            );

            $(ticket_create.parent_target + " .fileload-container .jspPane .error-files").append(parsed_html_data.error_block);
            $(ticket_create.parent_target + " .fileload-container .jspPane .valid-files").append(parsed_html_data.valid_block);


            ticket_create.checkNotUploadedFiles();
         

            $.each(
                $(ticket_create.parent_target + " .fileload-container .to-handle-events"),
                function(iter, file_block){
                    $(file_block).find('.select-file-type select').select2({
                        placeholder: "File Type",
                        //dropdownParent: $(this).closest('.fileload-item').find('.select-file-type'),
                        minimumResultsForSearch: -1,
                        containerCssClass: 'custom-select-wrapper',
                        dropdownCssClass: 'custom-select-wrapper'       
                    });

                    $(file_block).removeClass('to-handle-events');
                }
            );


            ticket_create.modal_upload_scroll_pane.api.reinitialise();

            if(ticket_create.modal_upload_scroll_pane.api.getContentHeight() > ticket_create.modal_upload_scroll_pane.max_height) {
                $(ticket_create.parent_target + " .fileload-container").css('height', ticket_create.modal_upload_scroll_pane.max_height + "px");
            } else {
                $(ticket_create.parent_target + " .fileload-container").css('height', ticket_create.modal_upload_scroll_pane.api.getContentHeight() + "px");
            }

            ticket_create.modal_upload_scroll_pane.api.reinitialise();
            
            if(from_messages) {
                $(ticket_create.parent_target+" #ticket_files_input_messages").val(''); 
                
//                $('.messages-body-wrap .submit_btn').trigger('click');
//                $(".messages-body-wrap textarea").trigger('input'); 
                    setTimeout(function() {
                         $("#content-wrapper").animate({ scrollTop: 9999999 }, 0);
                    }, 200);
                 
            } else {
                $(ticket_create.parent_target+" #ticket_files_input").val('');
            }
        }
    },
    updateFileUploadModalHeight: function () {
        if(ticket_create.modal_upload_scroll_pane.api.getContentHeight() > ticket_create.modal_upload_scroll_pane.max_height) {
            $(ticket_create.parent_target + " .fileload-container").css('height', ticket_create.modal_upload_scroll_pane.max_height + "px");
        } else {
            $(ticket_create.parent_target + " .fileload-container").css('height', ticket_create.modal_upload_scroll_pane.api.getContentHeight() + "px");
        }

        ticket_create.modal_upload_scroll_pane.api.reinitialise();
    },
    checkNotUploadedFiles: function () {
        var error_uploaded_files = $(ticket_create.parent_target + " .fileload-container .error-files .fileload-item");
     
        var upload_btn = ticket_create.parent_target == '#TicketFilesMessagesWrap' ? $(ticket_create.parent_target + ' .messages-body-wrap .messeges-btn-holder .submit_btn')  : $(ticket_create.parent_target + " [data-submit-modal]");
        var attach_error = ticket_create.parent_target == '#TicketFilesMessagesWrap' ? $(ticket_create.parent_target +' > .attachment-error') : $("#ModalCreateTicket .modal-body > .attachment-error");           
        if (error_uploaded_files.length > 0) {
            attach_error.show();
            upload_btn
                    .addClass('submit_btn-disabled')
                    .addClass('btn-disabled')
                    .addClass('btn-disabled-msg')
                    .addClass('disabled-btn');
        } else {
            attach_error.hide();
            upload_btn
                    .removeClass('submit_btn-disabled')
                    .removeClass('btn-disabled')
                    .removeClass('disabled-btn')
                    .removeClass('btn-disabled-msg')
                    .attr('disabled', false)
                    .removeAttr('style')
                    .find('.sk-fading-circle').hide();            
        }
    },
    removeTmpFile: function () {
        var button = $(this),
            file_block = button.parent().closest('.fileload-item');
            
        delete ticket_create.uploaded_files_list[file_block.attr('data-file-temp-name')];
        delete ticket_create.uploaded_files_ids[file_block.attr('data-file-temp-name')];

        file_block.slideUp(200, function(){
            $(this).detach();

            ticket_create.checkNotUploadedFiles();
     
            ticket_create.modal_upload_scroll_pane.api.reinitialise();

            ticket_create.updateFileUploadModalHeight();
        });
    },
    retryFileUpload: function(e) {
       e.preventDefault();
       var tmp_name = $(this).closest("[data-file-temp-name]").attr('data-file-temp-name');
       var self = this;
       $(this).closest("[data-file-temp-name]").hide();
       ticket_create.preloadFiles([ticket_create.uploaded_files_list[tmp_name]], true);
       ticket_create.removeTmpFile.call(self);  
    },
    updateFileUploadProcess: function (file_tmp_name) {
        var file_block = $("#ModalCreateTicket .fileload-item[data-file-temp-name='"+file_tmp_name+"']");
        var current_status = parseInt(file_block.find('.file_load_progress').attr('aria-valuenow'));

        // calculate what part of file can be uploaded in 1/20 of second
        var step_for_progress =  1/(ticket_create.uploaded_files_list[file_tmp_name].size / (internet_speed.value.bytes/20 /* speed for 1/20 sec */));

        // if (step_for_progress > 1) -> file will be uploaded faster than 1/20 sec
        if (step_for_progress > 1) {
            file_block.find('.file_load_progress').attr('aria-valuenow', '100')
                    .find('.progress-bar').css('width', '100%');
        } else {
            var new_status = current_status + (step_for_progress*100);

            new_status = new_status > 100 ? 100 : new_status;

            file_block.find('.file_load_progress').attr('aria-valuenow', new_status)
                    .find('.progress-bar').css('width', new_status+'%');

        }
    },
    upload_files: function (callback) {
        $.each(
            ticket_create.uploaded_files_list,
            function(file_tmp_name, file_data){
                form_data = new FormData();
                
                var file_block = $(ticket_create.parent_target + " .fileload-item[data-file-temp-name='"+file_tmp_name+"']");
                form_data.append('file_tmp_name', file_tmp_name);
                form_data.append('files[]', file_data);
                if(ticket_create.parent_target == "#TicketFilesMessagesWrap") {
                    form_data.append('ticket_id', TICKET.id);
                }
                if(ticket_create.uploaded_files_after_reload[file_tmp_name]) {
                    delete ticket_create.uploaded_files_after_reload[file_tmp_name];
                } else {
                    ticket_create.files_left_to_upload++;
                }
                

                file_block.find('.file-load-cancel, .file_load_size').fadeOut(100, function(){
                    file_block.find('.file_load_progress').fadeIn(100);
                });

                ticket_create.uploaded_files_list[file_tmp_name].interval = setInterval(ticket_create.updateFileUploadProcess, 50, file_tmp_name); // 1/20 part of secont
                
                $.ajax({
                    url: 'tickets?ajax=AddFile', // point to server-side PHP script
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: form_data,
                    method: 'POST',
                    type: 'POST',
                    success: function (data) {
                        var upload_result = JSON.parse(data).upload_result;

                        clearInterval(ticket_create.uploaded_files_list[upload_result.file_tmp_name].interval);
                        ticket_create.uploaded_files_list[upload_result.file_tmp_name].interval = false;
                        ticket_create.uploaded_files_messages_names[upload_result.file_tmp_name]['file_message_text'] = upload_result.file_message_text; 
                        ticket_create.uploaded_files_ids[file_tmp_name]['id'] = upload_result.file_id;
                        
                        file_block.find('.file_load_progress').fadeOut(100, function(){
                            file_block.find('.upload-done-icon, .file_load_size').fadeIn(100);
                        });
                        
                        ticket_create.files_left_to_upload--;
                        ticket_create.success_upload = true;
                    },
                    error: function (data) {
                        clearInterval(ticket_create.uploaded_files_list[file_tmp_name].interval);
                        file_block.find('.file_load_progress, .file_load_size').fadeOut(100, function(){
                            file_block.find('.file-load-cancel').fadeIn(100);
                        });
                       file_block.hide();
                       ticket_create.preloadFiles([file_data])
                       ticket_create.removeTmpFile.call(file_block.find('.file-load-cancel'))               
                       ticket_create.success_upload = false; 
                    }
                });
            }
        );

        if(ticket_create.success_upload) {
            ticket_create.file_upload_interval = setInterval(function(){
            if(ticket_create.files_left_to_upload === 0){
                ticket_create.uploaded_files_list = {};
                clearInterval(ticket_create.file_upload_interval);
                callback();
            }
        }, 100);
        }
     
    },
    submit_form: function() {
        var create_ticket_modal = $("#ModalCreateTicket");

        var ticket_category = create_ticket_modal.find('#new-ticket-category').select2('data')[0].id;

        var subject_field = create_ticket_modal.find('input[name="new-ticket-subject"]');
        
        var message_field = create_ticket_modal.find('textarea[name="new-ticket-textarea"]');


        var form_data_obj = {
            ticket_category: ticket_category,
            ticket_subject: subject_field.val(),
            ticket_message: message_field.val()
        };
        
        if (Object.keys(ticket_create.uploaded_files_ids).length > 0) {
            var files_data = [];
            
            $.each(
                ticket_create.uploaded_files_ids,
                function (file_tmp_name, file_data) {
                    if (parseInt(file_data.id) > 0) {
                        files_data.push({id: file_data.id, name: file_data.name});
                    }
                }
            );
            if (files_data.length > 0) {
                form_data_obj['files'] = files_data;
            }
            
        }

        callAjax(
                'json',
                '/tickets?ajax=Create',
                function (response) {
    //                if(!ticket_create.is_settings_ticket){
    //                    var new_ticket_data = response.new_ticket_data;
    //                    var new_ticket_block_html = ticket_create.templates.ticket_item.fetch({
    //                        in_development: in_development,
    //                        ticket: {
    //                            id: new_ticket_data.id,
    //                            c_unread_mes: 0,
    //                            archived: 0,
    //                            creation_date: new_ticket_data.creation_date,
    //                            subject: new_ticket_data.subject,
    //                            category: new_ticket_data.category,
    //                            c_message: new_ticket_data.message
    //                        }
    //                    });   
    //                    
    //                    $(".tickets .order-list-inner .list-content").prepend(new_ticket_block_html);
    //               }  

                    ticket_create.uploaded_files_ids = {};
                    
                    if ($(".tickets [data-help-desk-filters] [data-button-submit-form-tickets-filter]").length > 0) {
                        $(".tickets [data-help-desk-filters] [data-button-submit-form-tickets-filter]").click();
                    }
                                        
                    setTimeout(function () {
                        create_ticket_modal.find('[data-submit-modal] .sk-fading-circle').hide();
                        ticket_create.clear_modal(true);
                        if (ticket_create.is_settings_ticket) {
                            var selectedOption = create_ticket_modal.find('#new-ticket-category').find('option[value="' + ticket_category + '"]');
                            $("#ModalTicketCreated").find('.ticket-created-cat').text(selectedOption.text());
                            $("#ModalTicketCreated").modal('show');
                        }
                    }, 500);
                    if (!ticket_create.is_settings_ticket) {
                        if(response.ticket_created.new_ticket_id) {
                            setTimeout('location="/tickets/?subcom=detailed&id='+response.ticket_created.new_ticket_id+'"', 500);
                        }
                    }
                    
                },
                form_data_obj
        );
    },
    submit_from_messages: function() {
        ticket_create.uploaded_files_ids = {};
            $.each(
                ticket_create.uploaded_files_messages_names,
                function (file_tmp_name, message_obj) {
                    if (message_obj) {
                         addNewMessageToTicket({from:CURRENT_USER.id, message:message_obj.file_message_text, is_file:true});
                    }
                }
            );      
        ticket_create.uploaded_files_messages_names = {};
        ticket_create.uploaded_files_list = {};
        $(ticket_create.parent_target + " .fileload-container .jspPane .error-files").html("");
        $(ticket_create.parent_target + " .fileload-container .jspPane .valid-files").html("");
        setTimeout(function() {
            ticket_create.updateFileUploadModalHeight();

        }, 100)
        ticket_create.modal_upload_scroll_pane.api.reinitialise();
        
        $(ticket_create.parent_target).find('[name="message_text"]').val("");
        $(ticket_create.parent_target).find('[name="message_text"]').trigger('input'); // for textarea resize
        $(ticket_create.parent_target).find('.submit_btn').addClass('btn-disabled-msg');
    }
};

function ticketsList() {

    if (is_loading)
     return false; 

    $('[data-block-not-found-tickets]').empty();
    var holder = $('.order-main-wrap').find('.list-content');

    if (append_ticket_list) {        
        limit_from_ticket = limit_from_ticket + 20;
        holder.append(loader);
    } else {
        $('[data-counter-help-desk]').empty();
        holder.empty();
        holder.html(loader);
        limit_from_ticket = 0;
    }

    var request_data = [$('#form-help-desk').serialize(), $.param({limit_from: limit_from_ticket})].join('&');    

    is_loading = true;
    callAjax('json', '/tickets?ajax=listTickets', function (data) {
        is_loading = false;
                      
        var tpl = new jSmart($('#tickets_list_item_template').html());
                   
        if (append_ticket_list) {
            holder.find('[data-loader-html]').remove();
        } else {
            holder.empty();
        }
        for (i in data.tickets) {
            var key_name = "ticket";
            var template_values = {};
            template_values[key_name] = data.tickets[i];
            template_values.current_user = CURRENT_USER;            
            item_html = tpl.fetch(template_values);
            holder.append(item_html);
        }
            
        $('[data-counter-help-desk]').html(data.all_tickets_count + ' found');
        if (data.all_tickets_count == 0) {
            //$('[data-block-order-list-filters]').addClass('no-orders');
            if (use_filter_form) {
                var tpl = new jSmart($('#not_found_by_filter').html());
                var item_html = tpl.fetch();
                $('[data-block-not-found-tickets]').append(item_html);
                use_filter_form = false;
            } else {
                var tpl = new jSmart($('#not_found_tickets').html());
                var item_html = tpl.fetch();
                $('[data-block-not-found-tickets]').append(item_html);
            }
        } 
         
        if (data.count < 20) {
            holder.attr('data-all-items-loaded', true);
            /*if (append_ticket_list) {
                $('[data-last-order]').show();
            }*/
        } else {
            holder.attr('data-all-items-loaded', false);
        }        
        
        append_ticket_list = false;
        
    }, request_data);

}

var use_filter_form = false;
$(document).on("click", "[data-button-submit-form-tickets-filter]", function (event,param1) {
    use_filter_form = true;   

    var url_current = new URL(document.location.href);
    var params = new URLSearchParams(url_current.search.slice(1));
    
    setFilterValuesString($('#form-help-desk'), 'query_string', params);
    setFilterValuesString($('#form-help-desk'), 'category[]', params);
    if(param1 != 'set_default'){
        setFilterValuesString($('#form-help-desk'), 'status[]', params);    
    }    
    
    if (params.toString()) {
        window.history.pushState("object or string", "Page Title", url_current.pathname + '?' + params);
    } else {
        window.history.pushState("object or string", "Page Title", url_current.pathname);
    }
    
    if($('#form-help-desk').find('[name="query_string"]').val().trim().length == 0
            && $('#form-help-desk').find('[name="status[]"]').val().length == 1 
            && $('#form-help-desk').find('[name="status[]"]').val()[0] == 'active' 
            && $('#form-help-desk').find('[name="category[]"]').val().length == 1 
            && $('#form-help-desk').find('[name="category[]"]').val()[0] == 'any'
    ) {
        use_filter_form = false;
    }
    
    if ($('[data-filter-set-block]').find('[data-filter-set-item]').length < 1) {
        $('[data-filter-set-block]').hide();
    }
        
    if ($(window).width() <= 767) {
         $(this).parents().find('[data-help-desk-filters]').fadeOut(300);
    }
    ticketsList();
});

$(document).on("show.bs.modal", "#ModalCreateTicket", function () {
     ticket_create.parent_target = "#ModalCreateTicket";
    $("#ModalCreateTicket .modal-body > .attachment-error").hide();
    ticket_create.modal_upload_scroll_pane.block = $("#ModalCreateTicket .fileload-container").jScrollPane();
    if (!ticket_create.is_settings_ticket) {
        ticket_create.templates.ticket_item = $("#tickets_list_item_template").length > 0 ? new jSmart($("#tickets_list_item_template")[0].innerHTML) : null;
    }
    ticket_create.modal_upload_scroll_pane.api = ticket_create.modal_upload_scroll_pane.block.data('jsp');
});

$(document).on("shown.bs.modal", "#ModalCreateTicket", function(){
    ticket_create.updateFileUploadModalHeight();
});

$(document).on("hide.bs.modal", "#ModalCreateTicket", function(){
    ticket_create.uploaded_files_list = {};

    $("#ModalCreateTicket .fileload-container .jspPane .error-files").html("");
    $("#ModalCreateTicket .fileload-container .jspPane .valid-files").html("");

    ticket_create.modal_upload_scroll_pane.api.reinitialise();
});

/*Mobile filters view*/
$(document).on("click", ".ticket-add-filters", function () {
    var windowWidth = $(window).width();
    if (windowWidth <= 767) {
        $(this).parents().find('[data-help-desk-filters]')
                .addClass('main-filter-area-mob')
                .fadeIn(300);
    } 
});

$(document).on("click", "[data-ticket-close-filters]", function () {
    $(this).parents().find('[data-help-desk-filters]').fadeOut(300);
});
/*Mobile filters view*/

/*//Ticket details mobile view*/
$(document).on("click", "[data-ticket-info]", function () {
    $(this).parents().find('.ticket-preview-wrap').fadeIn(300);
});

$(document).on('change', "#ModalCreateTicket #ticket_files_input", function(){
    ticket_create.preloadFiles($(this)[0].files);
});

$(document).on('change', "#ticket_files_input_messages", function(){
    ticket_create.parent_target = "#TicketFilesMessagesWrap";
     $( ticket_create.parent_target + "> .attachment-error").hide();
    ticket_create.modal_upload_scroll_pane.block = $(ticket_create.parent_target + " .fileload-container").jScrollPane();
    if (!ticket_create.is_settings_ticket) {
        ticket_create.templates.ticket_item = $("#tickets_list_item_template").length > 0 ? new jSmart($("#tickets_list_item_template")[0].innerHTML) : null;
    }

    ticket_create.modal_upload_scroll_pane.api = ticket_create.modal_upload_scroll_pane.block.data('jsp');
        ticket_create.updateFileUploadModalHeight();

    ticket_create.preloadFiles($(this)[0].files, false, true);
    
});

$(document).on("click", "[data-close-preview-tick]", function () {
    $(this).parent().closest('.ticket-preview-wrap').fadeOut(300);
});
/*//END Ticket details mobile view*/

/* Create Ticket */
$(document).on("input", "#ModalCreateTicket input[name='new-ticket-subject']", function () {
    ticket_create.subject.validate.call(this, true);
});
$(document).on("input", "#ModalCreateTicket textarea[name='new-ticket-textarea']", function () {
    ticket_create.message.validate.call(this, true);
});

$(document).on("click", "#ModalCreateTicket [data-submit-modal]", function () {
    var form_data = false;
    var create_ticket_modal = $("#ModalCreateTicket");
    
    /* Validate Subject Field */
    var subject_field = create_ticket_modal.find('input[name="new-ticket-subject"]');
    var valid_subject = ticket_create.subject.validate.call(subject_field, false);
    /* END Validate Subject Field */

    /* Validate Message Field */
    var message_field = create_ticket_modal.find('textarea[name="new-ticket-textarea"]');
    var valid_message = ticket_create.message.validate.call(message_field, false);
    /* END Validate Message Field */
    
    if (valid_subject && valid_message) {
        create_ticket_modal.find('[data-submit-modal] .sk-fading-circle').show();
        disableButton.call(create_ticket_modal.find('[data-submit-modal]'));
        
        if (Object.keys(ticket_create.uploaded_files_ids).length > 0) {
            ticket_create.upload_files(ticket_create.submit_form);
        } else {
            ticket_create.submit_form();
        }
    }       
    /* END Validate Subject Field */
});

$(document).on("click", "[data-ticket-modal-hot-desc]", function () {
    ticket_create.is_settings_ticket = false;    
    ticket_create.initialize.call(this);
});


$(document).on("click", "[data-ticket-modal-settings]", function () {
    ticket_create.is_settings_ticket = true;
    ticket_create.initialize.call(this);
});

$(document).ready(function(){
    if (getWindowWidth <= 767){
        ticket_create.modal_upload_scroll_pane.max_height = 800;
    } 
    
    
    
});
/* END Create Ticket */

/* Tickets js END*/
$(document).on("click", ".payment-wrap [data-tab='tab-balance-history']", function () {
    myBalanceList();
});

$(document).on("click", ".payment-wrap [data-tab='tab-payment-history']", function () {
    myPaymentList();
});

$(document).on("select2:select", "[data-filter='balance-history'] select", function () {
    use_filter_form = true;
    myBalanceList();
});

$(document).on("select2:unselect", "[data-filter='balance-history'] select", function () {
    use_filter_form = true;
    myBalanceList();
});

$(document).on("select2:select", "[data-filter='payment-history'] select", function () {
    use_filter_form = true;
    myPaymentList();
});

$(document).on("select2:unselect", "[data-filter='payment-history'] select", function () {
    use_filter_form = true;
    myPaymentList();
});

$(document).on("change", "[data-filter='payment-history'] input[name='maximum_profit']", function () {
    use_filter_form = true;
    myPaymentList();
});

$(document).on("click", "[data-link-csv]", function () {
    var form_id  = $(this).data('idForm');
    $('#'+form_id).append('<input type="hidden" name="ajax" value="'+$(this).data('linkCsv')+'">');
    $('#'+form_id).submit();    
    $('#'+form_id).find('input[name="ajax"]').remove();
    return false;
});

function initializeDaterangePickerPayments(){
    $('input[data-calendar="payment"]').daterangepicker({
        ranges: {
            "Last week": [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],            
            'Last month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            "Current year": [moment().startOf('year'), moment().endOf('year')]
        },
        singleDatePicker: true,
        singleDatePickerCanRange: true,
        applyRangeAfterOutsideClick: false,
        startDate: moment().subtract(1, 'year'),
        endDate: moment(),
        maxDate:  moment(),
        minDate: moment().subtract(1, 'year'),
        alwaysShowCalendars : true,
        showCustomRangeLabel: false, 
        template: '<div class="daterangepicker">' +                
                '<div class="drp-calendar left">' +
                    '<div class="calendar-table"></div>' +
                    '<div class="calendar-time"></div>' +
                '</div>' +
                '<div class="drp-calendar right">' +
                    '<div class="calendar-table"></div>' +
                    '<div class="calendar-time"></div>' +
                '</div>' +
                '<div class="ranges"></div>' +
                '<div class="drp-buttons">' +
                    '<button class="applyBtn" disabled="disabled" type="button"></button> ' +
                '</div>' +
            '</div>',
        locale: {
            format: 'MMM DD, YYYY',
            separator: ' - ',
            applyLabel: 'Confirm',
            "daysOfWeek": [
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat"
            ],
            "monthNames": [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ],
        }
    });                
    
    $('input[data-calendar="payment"]').on('apply.daterangepicker', function(ev, picker) {
        if($(this).parents('[data-filter="balance-history"]').length == 1){  
            $('[data-filter="balance-history"] input[name="date_from"]').val(picker.startDate.format('YYYY-MM-DD'));
            $('[data-filter="balance-history"] input[name="date_to"]').val(picker.endDate.format('YYYY-MM-DD'));
            use_filter_form = true;
            myBalanceList();
        }else if($(this).parents('[data-filter="payment-history"]').length == 1){
            $('[data-filter="payment-history"] input[name="date_from"]').val(picker.startDate.format('YYYY-MM-DD'));
            $('[data-filter="payment-history"] input[name="date_to"]').val(picker.endDate.format('YYYY-MM-DD'));
            use_filter_form = true;
            myPaymentList();
        }                        
    });
    
    //$('[data-filter] input[name="date_from"]').val(moment().startOf('month').format('YYYY-MM-DD'));
    $('[data-filter] input[name="date_from"]').val(moment().subtract(1, 'year').format('YYYY-MM-DD'));
    $('[data-filter] input[name="date_to"]').val(moment().format('YYYY-MM-DD'));        
   
    
    $('#content-wrapper').scroll(function () {
        if ($('body').attr('data-name-loaded-page') == 'my_balance') {
             $('input[data-calendar="payment"]').data('daterangepicker').hide();
        }
    }); 
    
}  

function myBalanceList() {
    if (is_loading)
        return false;
    
    $('[data-block-not-found-balance-history]').html('');
    $('[data-sum-balance-history-block]').hide();
    $('[data-sum-balance-history-minus]').hide();    
    var holder = $('.payment-wrap').find('.balance-history-list-content');
    holder.html(loader);
    
    is_loading = true;

    var request_data = $('#form-balance-history').serialize();
    if(default_balance_list_serialize){
        if(default_balance_list_serialize == request_data){
            use_filter_form = false;
        }       
    }else{
        default_balance_list_serialize = request_data;
    }
    
    callAjax('json', '/my_balance?ajax=listBalanceHistory', function (data) {
        is_loading = false;
        var tpl = new jSmart($('#balance_history_list_item_template').html());
        holder.empty();
        
        for (i in data.balance_history) {
            var key_name = "item";
            var template_values = {};
            template_values[key_name] = data.balance_history[i];
            template_values.current_user = CURRENT_USER;
            item_html = tpl.fetch(template_values);
            holder.append(item_html);
        }                
        
        if (data.balance_history_count == 0) {
            if(data.balance_history_count_all == 0){
                var tpl = new jSmart($('#not_found_balance_transactions').html());
            }else if(use_filter_form){
                use_filter_form = false;     
                var tpl = new jSmart($('#not_found_transactions_by_filter').html());     
            }else{
                var tpl = new jSmart($('#not_found_balance_transactions').html());
            }                           
            var item_html = tpl.fetch();
            $('[data-block-not-found-balance-history]').append(item_html);
            $('[data-balance-history-head]').removeClass('d-md-flex');
            $('[data-balance-history-head]').hide();
        }else{                        
            if(data.sum_amount<0){
                $('[data-sum-balance-history-minus]').show();
            }
            $('[data-sum-balance-history]').html(Math.abs(data.sum_amount));
            $('[data-balance-history-head]').addClass('d-md-flex');
            $('[data-balance-history-head]').show();
            $('[data-sum-balance-history-block]').show();
        }        
        
    }, request_data);
}

function myPaymentList() {
    if (is_loading)
        return false;
    
    $('[data-block-not-found-payment-history]').html('');
    $('[data-sum-payment-history-block]').hide();    
    var holder = $('.payment-wrap').find('.payment-history-list-content');
    holder.html(loader);
    
    is_loading = true;
    var request_data = $('#form-payment-history').serialize();     
    if(default_payment_list_serialize){
        if(default_payment_list_serialize == request_data){
            use_filter_form = false;
        }
    }else{
        default_payment_list_serialize = request_data;
    }
    callAjax('json', '/my_balance?ajax=listPaymentHistory', function (data) {
        is_loading = false;
        var tpl = new jSmart($('#payment_history_list_item_template').html());
        holder.empty();
        
        for (i in data.payments_history) {
            var key_name = "item";
            var template_values = {};
            template_values[key_name] = data.payments_history[i];
            template_values.current_user = CURRENT_USER;
            item_html = tpl.fetch(template_values);
            holder.append(item_html);
        }
                        
        if (data.payments_history_count == 0) {
            if(data.payments_history_count_all == 0){
                var tpl = new jSmart($('#not_found_payment_transactions').html());
            }else if(use_filter_form){
                use_filter_form = false;     
                var tpl = new jSmart($('#not_found_transactions_by_filter').html());     
            }else{
                var tpl = new jSmart($('#not_found_payment_transactions').html());                           
            }   
            var item_html = tpl.fetch();
            $('[data-block-not-found-payment-history]').append(item_html);
            $('[data-payment-history-head]').removeClass('d-md-flex');
            $('[data-payment-history-head]').hide();                   
        }else{    
            $('[data-payment-history-head]').addClass('d-md-flex');
            $('[data-payment-history-head]').show();
            $('[data-sum-payment-history]').html(data.sum_amount);
            $('[data-sum-payment-history-block]').show();    
        }                
    }, request_data);
}
/*SETTINGS PAGE JS*/

/*Personal info TAB JS*/

//edit fields form

//END edit fields form

/* edit phone select highlighted*/

jQuery(document).on('click', function (e) {
    var el = '.phone-box .select2';
    if (jQuery(e.target).closest(el).length)
        return;
    $('#input_phone').removeClass('select-highlight');
});
$('.phone-box .select2-phone').on('select2:unselect select2:select select2:close', function (evt) {
    $(this).parent().closest('.input-phone-inner').find('#input_phone').removeClass('select-highlight');
});
$(".phone-box .select2").on('click', function () {
    if ($(this).hasClass('select2-container--open')) {
        $('#input_phone').toggleClass('select-highlight');
    } else {
        $('#input_phone').removeClass('select-highlight');
    }
});
/* END edit phone select highlighted */

//select single search COUNTRY
$(".select-single-search").select2({
    containerCssClass: "select2-container-wb",
    dropdownCssClass: 'select2-dropdown-wb'
});
//END select single search COUNTRY

/*Qualification TAB JS */

$(document).on('change','.qualification-switch',function () {
    const switchRequest = {
        "name": $(this).attr('name'),
        "value": $(this).is(':checked') ? 1 : 0
    }
    callAjax("json", "settings?ajax=changeSwitch", function (data) {

    }, switchRequest, $(this).closest('form'))
})

$(document).on('change', '[name="payment_schedule"]', function () {   
      const switchRequest = {
        "name": $(this).attr('name'),
        "value": $(this).val()
    }
    callAjax('json', '/settings?ajax=changeSwitch', function (data, isError) {}, switchRequest);
});


$('#PaymentProcess').on('show.bs.modal', function (event) {    
    var button = $(event.relatedTarget);
    var tab = button.data('tab');        
    if(typeof (tab) !== "undefined"){       
         $(this).find('a[href="'+ tab +'"]').trigger('click');
    }else{
         $(this).find('a[href="#pTab-1"]').trigger('click');
    }
});


$(document).on('change',"input[name='paper_format[]']" ,function () {
    if ($(this).val() == 999) {
        if ($(this).is(':checked')) {
            //$("#other-paper-format").removeAttr('disabled');
            $("#other-paper-format").show();
        } else {
           // $("#other-paper-format").attr('disabled', true)
            $("#other-paper-format").hide();
        }
    }
})


$(document).on('click', "#save-paper-format", function (e) {
    e.preventDefault();
    let valid = true;
    const other_paper_format = $("#other-paper-format");
    other_paper_format.removeClass('alert-control');
    $("#other-paper-format-alert").hide();
    if ($("input[name='paper_format[]'][value=999]").is(':checked')) {
        if (other_paper_format.val().length < 1) {
            other_paper_format.addClass('alert-control');
            $("#other-paper-format-alert").show();
            valid = false;
        }
    } else {
        other_paper_format.val('');
    }

    if (valid) {
        const paper_format = [];
        $("#other-paper-format-alert").hide();
        $("input[name='paper_format[]']:checked").each(function () {
            paper_format.push($(this).val())
        })

        callAjax("json", "settings?ajax=paperFormat", function (data) {
            if (data.result.writer_update === true) {
                location.reload();
            }else{
                $("#other-paper-format-alert").text('An error occurred').show();
            }
        }, {
            "paper_format": paper_format,
            "other_paper_format": other_paper_format.val()
        }, $(this).closest('form'))
    }

})

$(document).on('click', "#save-languages", function (e) {
    // const other_language = [];
    // $("select[name='other_languages[]']:selected").each(function () {
    //     other_language.push($(this).val())
    // })

    callAjax("json", "settings?ajax=languages", function (data) {
        if (data.result.writer_update === true) {
            location.reload();
        }
    }, {
        "native_language": $("select[name='native_laguage']").val(),
        "other_language": $("select[name='other_languages[]']").val()
    }, $(this).closest('form'))
})

$("#about-me-textarea").on('keyup', function () {
    validate();
})

$("#about-me-save").on('click', function (e) {
    e.preventDefault();
    validate();
    if (!$(this).hasClass('submit_btn-disabled')) {
        callAjax("json", "settings?ajax=aboutMe", function (data) {
            if (typeof (data.result) !== "undefined" && data.result === true) {
                $("#ModalAboutMe").modal('hide');
                $("#about-me-result").text($("#about-me-textarea").val());
                $("#about_me_edit_available").show();
                $("#ModalAboutMeShow").hide();
            }
        }, {
            "about_me": $("#about-me-textarea").val()
        }, $(this).closest('form'))
    }
})

function getCount(words) {
    let count = 0;
    for (let i = 0; i < words.length; i++) {
        let word = words[i]
        if (word.length > 0 && word.match(/[a-zA-Z0-9]+/)) {
            count++;
        }
    }
    return count;
}

function validate() {
    const textArea = $("#about-me-textarea");
    const alertArea = $("#about-me-alert");
    const words = textArea.val().split(' ');
    const saveButton = $("#about-me-save");
    const countWords = getCount(words);

    saveButton.addClass('submit_btn-disabled');
    alertArea.hide();
    textArea.removeClass('error');
    if (countWords > 2) {
        saveButton.removeClass('submit_btn-disabled');
    }

    if (countWords > 0 && countWords < 3) {
        saveButton.addClass('submit_btn-disabled');
        alertArea.text('Please enter at least 3 words').show();
        textArea.addClass('error');
    }

    if (countWords == 0) {
        saveButton.addClass('submit_btn-disabled');
        alertArea.text('This field can\'t be empty').show();
        textArea.addClass('error');
    }

    if (countWords > 100) {
        saveButton.addClass('submit_btn-disabled');
        alertArea.text('Please enter no more than 100 words').show();
        textArea.addClass('error');
    }

    words.forEach((word) => {
        if (word.match(/[а-яА-Я]/g)) {
            saveButton.addClass('submit_btn-disabled');
            alertArea.text('Please note you can enter latin characters, numbers and symbols').show();
            textArea.addClass('error');
        }
    })
}

/*show more about me btn*/
(function checkShowMoreAboutBtn() {
    if ($('.settings-page [data-tab-name="qualification"]').hasClass('current')) {
        if ($(window).width() <= 767) {
            if ($('[data-three-lines]').height() > 40) {
                $('[data-show-more-details]').fadeIn();
            }
        } else {
            if ($('[data-three-lines]').height() > 60) {
                $('[data-show-more-details]').fadeIn();
            }
        }
    }
    setTimeout(checkShowMoreAboutBtn, 500);
})();
/*END show more about me btn*/

$(document).on('click', '[data-show-more-details]', function () {
    $(this).parent().find('[data-three-lines]').toggleClass('about-me-active');
});

$(document).on('select2:close', "select[name='other_languages[]']", function (e) {
    select2CustomMulti();
    select2CustomMultiPresetItems();
});

$(document).on('select2:select select2:unselect', "select[name='other_languages[]']", function (e) {
    var select = $("select[name='other_languages[]']");
    var values = select.val();
    var li = $("select[name='other_languages[]']").parent().find('.select2-results__options li[aria-selected="true"]');

    if (e.params.data.id == '999') { //none
        select.val(null);
        select.find("option[value='999']").prop('selected', true);
        li.each(function () {
            if ($(this).text() != 'None') {
                $(this).attr('aria-selected', false);
            } else {
                $(this).attr('aria-selected', true);
            }
        });
    } else if (values.indexOf('999') != -1) {
        values.splice(values.indexOf('999'), 1);
        select.val(values);
        li.each(function () {
            if ($(this).text() != 'None') {
                $(this).attr('aria-selected', true);
            } else {
                $(this).attr('aria-selected', false);
            }
        });       
    }
    
    var li = $("select[name='other_languages[]']").parent().find('.select2-results__options li[aria-selected="true"]');
    var uldiv = $(this).siblings('span.select2').find('ul');
    if (li.length > 1) {
        select.parent().find('.select2-selection__choice').addClass('d-none');
        select.parent().find('.select2-search__field-active').remove();
        uldiv.prepend("<li class='select2-selection__choice select2-choice-count'>" + li.length + " items selected</li>");
    } else{
        select.parent().find('.select2-search__field-active').remove();  
        select.parent().find('.select2-selection__choice.select2-choice-count').addClass('d-none');
        if(e.params.data.id == '999'){
            select.parent().find('.select2-selection__choice').addClass('d-none');
            select.parent().find('.select2-selection__choice[title="None"]').removeClass('d-none');  
        } else{
            select.parent().find('.select2-selection__choice').removeClass('d-none');        
            select.parent().find('.select2-selection__choice[title="None"]').addClass('d-none');              
        }        
    }

});
/* END Qualification TAB JS */

/*custom tooltip*/
$('.settings-page .order-option-tooltip').on('show.bs.tooltip', function () {
    $($(this).data('bs.tooltip').tip).addClass('tooltip-set-width');
});
/*custom tooltip*/

/*edit languages*/
$(document).on('click', '[data-edit-languages]', function () {
    $(this).hide();
    $(this).parents('.shadow-box').addClass('shadow-language-active');
    $(this).parent().closest('.shadow-box').find('.option-value-text').hide();
    $(this).parent().closest('.shadow-box').find('.sett-edit-box, [data-lang-btns]').fadeIn(300);
});
$(document).on('click', '[data-lang-cancel]', function () {
    $(this).parent().closest('.shadow-box').find('.sett-edit-box, [data-lang-btns]').hide();
    $(this).parent().closest('.shadow-box').find('.option-value-text').fadeIn(300);
    $(this).parent().closest('.shadow-box').find('[data-edit-languages]').fadeIn(300);
    $(this).parents('.shadow-box').removeClass('shadow-language-active');
});
/*END edit languages*/

/*START Personal info */

function initSettings() {

    validationFormByConfig($("#writer_change_email"), function ($form, $input) {
        validateButtonSubmit($form);
    }, function ($form, $input) {
        validateButtonSubmit($form);
    }, null, null, true);
    validationFormByConfig($("#writer_change_phone"), function ($form, $input) {
        validateButtonSubmit($form);
    }, function ($form, $input) {
        validateButtonSubmit($form);
    }, null, null, true);

    validationFormByConfig($("#writer_change_alt_email"), function ($form, $input) {
        validateButtonSubmit($form);
    }, function ($form, $input) {
        validateButtonSubmit($form);
    }, null, null, true);

    validationFormByConfig($("#writer_change_alt_phone"), function ($form, $input) {
        validateButtonSubmit($form);
    }, function ($form, $input) {
        validateButtonSubmit($form);
    }, null, null, true);
    validationFormByConfig($("#writer_change_city"), function ($form, $input) {
        validateButtonSubmit($form);
    }, function ($form, $input) {
        validateButtonSubmit($form);
    });

    validationFormByConfig($("#writer_change_country"), function ($form, $input) {
        validateButtonSubmit($form);
    }, function ($form, $input) {
        validateButtonSubmit($form);
    });

    //modal do you want Discard Changes
    (function () {
        $('[data-settings-wrap] ul.tabs li, a').click(function (e) {
            if ($('[data-settings-wrap] [data-tab-personal-info]').hasClass('current') && $('[data-settings-wrap] .sett-edit-box:visible').length) {
                e.preventDefault();
                e.stopPropagation();
                var button = $("#ModalDiscardChanges").find("button[type='submit']");
                var _this = $(this);
                if (_this.is('a') && _this.attr('data-ajax-load-page')) {
                    button.attr('data-ajax-load-page', _this.attr('data-ajax-load-page'));
                } else if (_this.is('a') && _this.attr('href')) {
                    button.attr('onclick', 'window.location.href="' + _this.attr('href') + '"');
                } else if (_this.is('li.tab-link')) {
                    button.attr('onclick', '$("[data-settings-wrap] .sett-edit-box:visible").each(function(){$(this).find("[data-sett-cancel]").click();});$("[data-settings-wrap] li.tab-link[data-tab=\'' + _this.attr('data-tab') + '\']").click();$("#ModalDiscardChanges").modal(\'hide\')');
                }
                $("#ModalDiscardChanges").modal('show');
            }
        });

        $("#ModalDiscardChanges").on('hide.bs.modal', function () {
            setTimeout(function () {
                $("#ModalDiscardChanges").find("button[type='submit']").attr('data-ajax-load-page', '').attr('onclick', '');
            }, 1500);
        });
    }());

    (function () {
        var timerBlockEmail = $('[data-time-block-verify="verify_mail_email"]');
        if (timerBlockEmail.length && timerBlockEmail.attr('data-time-left-verify')) {
            showTimerButton(timerBlockEmail, function () {
                timerBlockEmail.closest('button').removeClass(timerBlockEmail.closest('button').attr("data-class-disabled"));
            });
        }

        var timerBlockAltEmail = $('[data-time-block-verify="verify_mail_alt_email"]');
        if (timerBlockAltEmail.length && timerBlockAltEmail.attr('data-time-left-verify')) {
            showTimerButton(timerBlockAltEmail, function () {
                timerBlockAltEmail.closest('button').removeClass(timerBlockAltEmail.closest('button').attr("data-class-disabled"));
            });
        }
        
        var timerBlockPhone = $('[data-verify-button] [data-time-block-verify="verify_phone"]');
        if (timerBlockPhone.length && timerBlockPhone.attr('data-time-left-verify')) {
            showTimerButton(timerBlockPhone, function () {
                timerBlockPhone.closest('button').removeClass(timerBlockPhone.closest('button').attr("data-class-disabled-wait")).removeAttr("data-tooltip");

            });
        }
        
        var timerBlockAltPhone = $('[data-verify-button] [data-time-block-verify="verify_alt_phone"]');
        if (timerBlockAltPhone.length && timerBlockAltPhone.attr('data-time-left-verify')) {
            showTimerButton(timerBlockAltPhone, function () {
                timerBlockAltPhone.closest('button').removeClass(timerBlockAltPhone.closest('button').attr("data-class-disabled-wait")).removeAttr("data-tooltip");
            });
        }
        
    }());
    (function () {
        var contactInfoBlock = $("[data-contact-info-block]");
        if (contactInfoBlock.attr('data-email-successfully-verified')) {
            $(contactInfoBlock.attr('data-email-successfully-verified')).modal('show');
            $(contactInfoBlock.attr('data-email-successfully-verified')).on('hide.bs.modal', function () {
                redirect('/settings');
            });
        }

        $("[data-contact-info-block] input").focusout(function () {
            $(this).val($(this).val().trim());
        });
    }());
    (function () {
        var phoneInput = $("#writer_change_phone input[name='phone']");
        if (phoneInput.length) {
            formatPhoneNumber(phoneInput);
            phoneInput.change();
            $('#select-country-phone').find('option[value="' + $('#select-country-phone').attr('data-attr-current-country') + '"]').prop('selected', true).parent().change();
        }
        var phoneAltInput = $("#writer_change_alt_phone input[name='alt_phone']");
        if (phoneAltInput.length) {
            formatPhoneNumber(phoneAltInput);
            phoneAltInput.change();
            $('#select-country-alt-phone').find('option[value="' + $('#select-country-alt-phone').attr('data-attr-current-country') + '"]').prop('selected', true).parent().change();
        }

        var timezoneSelect = $("[data-form-timezone] select[name='timezone']");
        if (timezoneSelect.length) {
            if (timezoneSelect.attr('data-timezone-select-value')) {
                timezoneSelect.find('option[value="' + timezoneSelect.attr('data-timezone-select-value') + '"]').prop('selected', true).parent().change();
            } else {
                timezoneSelect.find('option[data-value-for-search="' + timezoneSelect.attr('data-timezone') + '"]').eq(0).prop('selected', true).parent().change();
            }
        }
    }());
    (function () {
        $("#ModalVerifyPhone [data-verification-code-form] input[name='code']").on('input change', function () {
            var $this = $(this);
            var onlySymb = $this.val().replace(/[^0-9a-zA-Z]/g, "");
            if (!onlySymb) {
                $this.val('');               
            }

            $this.removeClass('invalid-input error').parent().find('[data-error-block]').hide();

            //validation form
            $buttonSubmit = $this.closest('form').find('[data-submit-form="1"]');
            if($this.prop('disabled')){
               $buttonSubmit.removeClass('submit_btn-disabled'); 
            } else if (onlySymb && onlySymb.toString().length === 9) {
                $buttonSubmit.removeClass('submit_btn-disabled');
            } else {
                $buttonSubmit.addClass('submit_btn-disabled');
            }
            $this.val(onlySymb);
        });
    }());
    (function () {
        var dropArea = document.getElementById('dragndrop_proof_files_area');
        var _preventDefault = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        dropArea.addEventListener('dragenter', _preventDefault, false);
        dropArea.addEventListener('dragover', _preventDefault, false);
        dropArea.addEventListener('dragleave', _preventDefault, false);
        dropArea.addEventListener('drop', _preventDefault, false);

        dropArea.addEventListener('dragenter', function (e) {
            if (Object.keys(UploadIdentyProof.uploaded_files_list).length < UploadIdentyProof.limitFiles) {
                $(dropArea).addClass('drag-action');
            }
            return false;
        }, false);

        dropArea.addEventListener('dragleave', function (e) {
            $(dropArea).removeClass('drag-action');
            return false;
        }, false);

        dropArea.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            UploadIdentyProof.dragDropFile(e);
            return false;
        }, false);
    }());
    
    $('[name="account-holder"]').focusout(function () {
        var accountHolder = $(this);
        if (!(accountHolder.val().match(/[\w\s]+/) && accountHolder.val().trim().split(' ').length >= 2)) {
            accountHolder.addClass('error');
            accountHolder.closest('.input-form').find('.alert-hint').show();
        } else {
            accountHolder.removeClass('error');
            accountHolder.closest('.input-form').find('.alert-hint').hide();
        }
    });
    
    $('input[name="wmz-purse-number"]').focusout(function () {
        var wmzNumber = $(this);
        if (wmzNumber.val().length == 0) {
            wmzNumber.addClass('error');
            wmzNumber.closest('.input-form').find('.alert-hint.wrong-symbols').hide();
            wmzNumber.closest('.input-form').find('.alert-hint.empty').show();
        } else if (!wmzNumber.val().match(/^Z\d{12}$/)) {
            wmzNumber.addClass('error');
            wmzNumber.closest('.input-form').find('.alert-hint.empty').hide();
            wmzNumber.closest('.input-form').find('.alert-hint.wrong-symbols').show();
        } else{
            wmzNumber.removeClass('error');
            wmzNumber.closest('.input-form').find('.alert-hint.empty').hide();
            wmzNumber.closest('.input-form').find('.alert-hint.wrong-symbols').hide(); 
        }
    });

}

function showTimerButton($timeBlock, callbackAfterStopTimer) {
    var callbackAfterStopTimer = callbackAfterStopTimer || null;
    var intervalEmail = setInterval(function () {

        var timeNow = Math.floor(Date.now() / 1000);
        var time = $timeBlock.attr('data-time-left-verify') - timeNow;
        if (time > 0) {

            $timeBlock.show();
            var minutes = Math.floor(time / 60);
            if (minutes < 10) {
                minutes = '0' + minutes.toString();
            }

            var seconds = time % 60;
            if (seconds < 10) {
                seconds = '0' + seconds.toString();
            }

            var timeShow = minutes + ':' + seconds;
            $timeBlock.text(
                    $timeBlock.attr('data-text').replace('%time%', timeShow)
                    );
        } else {
            $timeBlock.hide();
            clearInterval(intervalEmail);
            callbackAfterStopTimer($timeBlock);
        }
    }, 1000);
    return intervalEmail;
}

function formatPhoneNumber($phone) {
    $phone.on('input change', function () {
        var $this = $(this);
        var onlyNum = $this.val().match(/([0-9]+)/g);
        if (!onlyNum) {
            $this.val('');
            return false;
        }
        onlyNum = onlyNum.join('').substring(0, 100);

        var result = '(';
        for (var i = 0; i < onlyNum.length; i++) {
            if (i == 3) {
                result += ')';
            }
            if (i == 6) {
                result += ' - ';
            }

            result += onlyNum.charAt(i);
        }
        $this.val(
                result
                );
    });
}

$(document).on('click', '[data-sett-edit]', function () {
    var button = $(this);
    var parent = button.parents('.order-details-block');

    parent.addClass('active');
    parent.find('[data-sett-edit], .order-option .aproved-check').hide();
    parent.find('.order-option').show();
    parent.find('.option-value-text').hide();
    parent.find('.sett-edit-box, .qualification-box').fadeIn(300);
    parent.find('.verify-resend-box').hide();

    var input = parent.find('.block_element input');
    if (input.length && input.val() && input.closest('form').attr('data-validate-submit-after-open')) {
        validateButtonSubmit(input.closest('form'));
    }

    if (parent.closest('.settings-det-password').length > 0) {
        parent.closest('.settings-det-password').addClass('settings-det-password-active');
    }
});

$(document).on('click', '[data-sett-cancel]', function () {
    var button = $(this);
    var parent = button.parents('.order-details-block');

    if (parent.find('[data-add-email-button][data-sett-edit], [data-add-alt-phone-button][data-sett-edit]').length) {
        parent.find('.order-option').hide();
        parent.find('.option-value-text').hide();
    } else {
        parent.find('.order-option').show();
        parent.find('.option-value-text').show();
    }
    parent.removeClass('active');
    parent.find('[data-sett-edit], .order-option .aproved-check').show();
    parent.find('.sett-edit-box').hide();
    parent.find('[data-lang-btns]').hide();
    parent.find('.verify-resend-box').show();

    parent.find('.error').removeClass('error');
    if(button.closest('.settings-det-password').length){
        parent.find('.alert-required').hide();
    } else{
        parent.find('.alert-required').remove();
    }
    
    parent.find('input[data-default-value]').each(function () {
        $(this).val($(this).attr('data-default-value')).change();
    });

    parent.find('select[data-default-value]').each(function () {
        if ($(this).attr('name') == 'timezone') {
            var timezoneSelect = $(this);
            if (timezoneSelect.attr('data-timezone-select-value')) {
                timezoneSelect.find('option[value="' + timezoneSelect.attr('data-timezone-select-value') + '"]').prop('selected', true).parent().change();
            } else {
                timezoneSelect.find('option[data-value-for-search="' + timezoneSelect.attr('data-timezone') + '"]').eq(0).prop('selected', true).parent().change();
            }
        } else {
            $(this).find('option[value="' + $(this).attr('data-default-value') + '"]').prop('selected', true).parent().change();
        }
    });

    if (parent.closest('.settings-det-password').length > 0) {
        parent.closest('.settings-det-password').removeClass('settings-det-password-active');
    }
});

$(document).on('click', '[data-modal-change-phone]', function () {
    var button = $(this);
    button.closest('.modal').modal('hide');
    if (button.closest('.modal').find('[data-resend-code]').attr('data-type-row') == 'alt_phone') {
        $("[data-edit-alt-phone-button]").click();
    } else {
        if ($("#writer_change_phone").length) {
            $("[data-edit-phone-button]").click();
        } else {
            $("[data-request-change-phone]").click();
        }
    }
});

$(document).on('click', '#writer_change_email [data-submit-form]', function (event) {

    event.preventDefault();
    event.stopPropagation();

    var $form = $(this).closest('form');
    var $email = $form.find('input[name="email"]');

    $email.val($email.val().trim());
    if (!$form.valid()) {
        return false;
    }

    $form.find('[data-submit-form]').find('.sk-fading-circle').show();
    callAjax("json", "/settings?ajax=ChangeEmail", function (data) {
        $form.find('[data-submit-form]').find('.sk-fading-circle').hide();
        if (typeof (data.result.result) !== "undefined" && data.result.result === true) {
            removeCookie('time_disabled_email_verification');
            redirect('/settings');
        }
    }, $form.serialize(), $form);
});

$(document).on('click', '[data-verify-email] [data-verify-button]', function (event) {

    event.preventDefault();
    event.stopPropagation();

    var $button = $(this);
    if ($button.hasClass($button.attr("data-class-success")) || $button.hasClass($button.attr("data-class-disabled")) || $button.attr('data-count-verify-attempts') == 0) {
        return false;
    }

    callAjax('json', '/verification?ajax=resendEmailVerificationCode', function (data) {
        if (data.result) {
            if ($button.attr('data-count-verify-attempts') == $button.attr('data-max-count-verify-attempts')) {

                //button
                $button.find('[data-button-name]').text($button.attr("data-text-success"));
                $button.addClass($button.attr("data-class-success"))
                        .parent().find('[data-email-verify-email-hint="3"]').fadeIn(300);

                //timer
                var durationTime = (1 * 60);
                var timeToActive = Math.floor(Date.now() / 1000) + durationTime;
                setCookie('time_disabled_email_verification', timeToActive, durationTime);
                setTimeout(function () {

                    //button
                    $button.removeClass($button.attr("data-class-success")).addClass($button.attr("data-class-disabled"));
                    $button.find('[data-button-name]').text($button.attr("data-text-recent"));
                    $button.attr('data-count-verify-attempts', $button.attr('data-count-verify-attempts') - 1);

                    //alerts
                    $button.parent().find('[data-email-verify-email-hint="4"]').fadeOut(300);
                    $button.parent().find('[data-email-verify-email-hint="3"]').fadeOut(300);
                    $button.parent().find('[data-email-verify-email-hint="1"]').fadeIn(300);
                    $button.parent().find('[data-email-verify-email-hint="2"]').text('You have ' + ($button.attr('data-count-verify-attempts')) + ' attempts').fadeIn(300);

                    //overwrite timer
                    var durationTime = (1 * 60);
                    var timeToActive = Math.floor(Date.now() / 1000) + durationTime;
                    setCookie('time_disabled_email_verification', timeToActive, durationTime);
                    var $timeBlock = $button.find('[data-time-block-verify]');
                    $timeBlock.attr('data-time-left-verify', timeToActive);
                    showTimerButton($timeBlock, function (_$timeBlock) {
                        _$timeBlock.closest('button').removeClass($button.attr("data-class-disabled"));
                    });
                }, 10000);

            } else if ($button.attr('data-count-verify-attempts') == 1) {

                //button
                $button.find('[data-button-name]').text($button.attr("data-text-success"));
                $button.addClass($button.attr("data-class-success"));
                $button.attr('data-count-verify-attempts', 0);

                //alerts
                $button.parent().find('[data-email-verify-email-hint="4"]').fadeIn(300);
                $button.parent().find('[data-email-verify-email-hint="1"]').fadeOut(300);
                $button.parent().find('[data-email-verify-email-hint="3"]').fadeOut(300);
                $button.parent().find('[data-email-verify-email-hint="2"]').fadeOut(300);

                //timer
                $button.find('[data-time-block-verify]').hide();
            } else {

                //button
                $button.removeClass($button.attr("data-class-success")).addClass($button.attr("data-class-disabled"));
                $button.find('[data-button-name]').text($button.attr("data-text-recent"));
                $button.attr('data-count-verify-attempts', $button.attr('data-count-verify-attempts') - 1);
                //alerts

                $button.parent().find('[data-email-verify-email-hint="4"]').fadeOut(300);
                $button.parent().find('[data-email-verify-email-hint="3"]').fadeOut(300);          
                $button.parent().find('[data-email-verify-email-hint="2"]').text('You have ' + ($button.attr('data-count-verify-attempts')) + ($button.attr('data-count-verify-attempts') == '1' ? ' attempt' : ' attempts')).fadeIn(300);

                //timer
                var durationTime = (1 * 60);
                var timeToActive = Math.floor(Date.now() / 1000) + durationTime;
                setCookie('time_disabled_email_verification', timeToActive, durationTime);
                var $timeBlock = $button.find('[data-time-block-verify]');
                $timeBlock.attr('data-time-left-verify', timeToActive);
                showTimerButton($timeBlock, function (_$timeBlock) {
                    _$timeBlock.closest('button').removeClass($button.attr("data-class-disabled"));
                });
            }
        }
    }, {from_settings_page: true});
});

$(document).on('click', '#writer_change_phone [data-submit-form], #writer_change_phone_modal [data-submit-form]', function (event) {
    event.preventDefault();
    event.stopPropagation();

    var $form = $(this).closest('form');
    var data = {
        phone: $form.find('input[name="phone"]').val().replace(/\D/g, ""),
        country_code_phone: $form.find('select[name="country_code_phone"]').val()
    };

    if (!$form.valid()) {
        return false;
    }

    $form.find('[data-submit-form]').find('.sk-fading-circle').show();

    callAjax("json", "/settings?ajax=ChangePhone", function (data) {
        $form.find('[data-submit-form]').find('.sk-fading-circle').hide();
        if (typeof (data.result.result) !== "undefined" && data.result.result === true) {
            if ($form.attr('id') == 'writer_change_phone_modal') {
                initModalVerifyAfterEdit();
                if ($('[data-name-loaded-page]').attr('data-name-loaded-page') == 'settings') {
                    redirect('/settings');
                }
            } else {
                redirect('/settings');
            }

        }
    }, data, $form);
});

$(document).on('click', '#writer_change_alt_email [data-submit-form]', function (event) {

    event.preventDefault();
    event.stopPropagation();

    var $form = $(this).closest('form');
    var $email = $form.find('input[name="alt_email"]');

    $email.val($email.val().trim());
    if (!$form.valid()) {
        return false;
    }

    $form.find('[data-submit-form]').find('.sk-fading-circle').show();
    callAjax("json", "/settings?ajax=ChangeAltEmail", function (data) {
        $form.find('[data-submit-form]').find('.sk-fading-circle').hide();
        if (typeof (data.result.result) !== "undefined" && data.result.result === true) {
            removeCookie('time_disabled_alt_email_verification');
            redirect('/settings');
        }
    }, $form.serialize(), $form);
});


$(document).on('click', '[data-verify-alt-email] [data-verify-button]', function (event) {

    event.preventDefault();
    event.stopPropagation();

    var $button = $(this);
    if ($button.hasClass($button.attr("data-class-success")) || $button.hasClass($button.attr("data-class-disabled")) || $button.attr('data-count-verify-attempts') == 0) {
        return false;
    }

    callAjax('json', '/verification?ajax=resendAltEmailVerificationCode', function (data) {
        if (data.result) {
            if ($button.attr('data-count-verify-attempts') == $button.attr('data-max-count-verify-attempts')) {

                //button
                $button.find('[data-button-name]').text($button.attr("data-text-success"));
                $button.addClass($button.attr("data-class-success"))
                        .parent().find('[data-email-verify-email-hint="3"]').fadeIn(300);

                //timer
                var durationTime = (1 * 60);
                var timeToActive = Math.floor(Date.now() / 1000) + durationTime;
                setCookie('time_disabled_alt_email_verification', timeToActive, durationTime);
                setTimeout(function () {

                    //button
                    $button.removeClass($button.attr("data-class-success")).addClass($button.attr("data-class-disabled"));
                    $button.find('[data-button-name]').text($button.attr("data-text-recent"));
                    $button.attr('data-count-verify-attempts', $button.attr('data-count-verify-attempts') - 1);

                    //alerts
                    $button.parent().find('[data-email-verify-email-hint="4"]').fadeOut(300);
                    $button.parent().find('[data-email-verify-email-hint="3"]').fadeOut(300);
                    $button.parent().find('[data-email-verify-email-hint="1"]').fadeIn(300);
                    $button.parent().find('[data-email-verify-email-hint="2"]').text('You have ' + ($button.attr('data-count-verify-attempts')) + ' attempts').fadeIn(300);

                    //overwrite timer
                    var durationTime = (1 * 60);
                    var timeToActive = Math.floor(Date.now() / 1000) + durationTime;
                    setCookie('time_disabled_alt_email_verification', timeToActive, durationTime);
                    var $timeBlock = $button.find('[data-time-block-verify]');
                    $timeBlock.attr('data-time-left-verify', timeToActive);
                    showTimerButton($timeBlock, function (_$timeBlock) {
                        _$timeBlock.closest('button').removeClass($button.attr("data-class-disabled"));
                    });
                }, 10000);

            } else if ($button.attr('data-count-verify-attempts') == 1) {

                //button
                $button.find('[data-button-name]').text($button.attr("data-text-success"));
                $button.addClass($button.attr("data-class-success"));
                $button.attr('data-count-verify-attempts', 0);

                //alerts
                $button.parent().find('[data-email-verify-email-hint="4"]').fadeIn(300);
                $button.parent().find('[data-email-verify-email-hint="1"]').fadeOut(300);
                $button.parent().find('[data-email-verify-email-hint="3"]').fadeOut(300);
                $button.parent().find('[data-email-verify-email-hint="2"]').fadeOut(300);

                //timer
                $button.find('[data-time-block-verify]').hide();
            } else {

                //button
                $button.removeClass($button.attr("data-class-success")).addClass($button.attr("data-class-disabled"));
                $button.find('[data-button-name]').text($button.attr("data-text-recent"));
                $button.attr('data-count-verify-attempts', $button.attr('data-count-verify-attempts') - 1);
                
                //alerts
                $button.parent().find('[data-email-verify-email-hint="4"]').fadeOut(300);
                $button.parent().find('[data-email-verify-email-hint="3"]').fadeOut(300);
                $button.parent().find('[data-email-verify-email-hint="2"]').fadeIn(300);                
                $button.parent().find('[data-email-verify-email-hint="2"]').text('You have ' + ($button.attr('data-count-verify-attempts')) + ($button.attr('data-count-verify-attempts') == '1' ? ' attempt' : ' attempts')).fadeIn(300);

                //timer
                var durationTime = (1 * 60);
                var timeToActive = Math.floor(Date.now() / 1000) + durationTime;
                setCookie('time_disabled_alt_email_verification', timeToActive, durationTime);
                var $timeBlock = $button.find('[data-time-block-verify]');
                $timeBlock.attr('data-time-left-verify', timeToActive);
                showTimerButton($timeBlock, function (_$timeBlock) {
                    _$timeBlock.closest('button').removeClass($button.attr("data-class-disabled"));
                });
            }
        }
    }, {from_settings_page: true});
});

$('#ModalVerifyPhone').on('hidden.bs.modal', function () {
    $('#ModalVerifyPhone').find('[data-resend-code]').attr('data-type-row', '');
    $('#ModalVerifyPhone').find('input[name="code"]').val('').prop('disabled', false).removeClass('invalid-input').
            parent().find('.alert-hint').hide();
});

$(document).on('click', '#writer_change_alt_phone [data-submit-form]', function (event) {
    event.preventDefault();
    event.stopPropagation();

    var $form = $(this).closest('form');
    if (!$form.valid()) {
        return false;
    }

    var data = {
        alt_phone: $form.find('input[name="alt_phone"]').val().replace(/\D/g, "")
    };

    $form.find('[data-submit-form]').find('.sk-fading-circle').show();

    callAjax("json", "/settings?ajax=ChangeAltPhone", function (data) {
        $form.find('[data-submit-form]').find('.sk-fading-circle').hide();
        if (typeof (data.result.result) !== "undefined" && data.result.result === true) {
            redirect('/settings');
        }
    }, data, $form);
});

 var counter_submit_code =  {
     phone: 0,
     alt_phone: 0,
     max: 3
 };

var submit_recend_phone_code = false;
var intervalModificatorModalTimer = null;
function clearIntervalModalTimer(){
    if(intervalModificatorModalTimer){
        clearInterval(intervalModificatorModalTimer);
    }
}
$(document).on('click', '[data-verify-phone] [data-verify-button], [data-verify-alt-phone] [data-verify-button], #ModalVerifyPhone [data-resend-code]', function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (submit_recend_phone_code) {
        return false;
    }

    var modal = $('#ModalVerifyPhone');
    var $buttonResend = modal.find('[data-resend-code]');

    if ($(this).attr('data-type-row') == 'alt_phone') {
        $buttonResend.attr('data-type-row', 'alt_phone');
        var $button = $("[data-verify-alt-phone] [data-verify-button]");
        var urlVerification = '/verification?ajax=resendAltPhoneVerificationCode';
    } else {
        $buttonResend.attr('data-type-row', 'phone');
        var $button = $("[data-verify-phone] [data-verify-button]");
        var urlVerification = '/verification?ajax=resendPhoneVerificationCode';
    }

    if ($button.length == 0 || $button.is(":disabled") || $button.attr('data-count-verify-attempts') <= 0) { //no attemps
        
        return false;
                
    } else if ($button.hasClass($button.attr("data-class-disabled-wait"))) {//when code was sent user can jsut open modal without resent code  
        
        if ($button.attr('data-count-verify-attempts') <= 0) {    
            
            modal.find('[data-text-resend]').hide();
            modal.find('[data-text-no-resend]').show();      
            
        } else {            
            modal.find('[data-text-resend]').show();
            modal.find('[data-text-no-resend]').hide();

            var $timeBlock = modal.find('[data-time-block-verify]');
            
            if ($buttonResend.attr('data-type-row') == 'alt_phone') {
                var timeToActive = getCookie('time_disabled_alt_phone_verification');
            } else {
                var timeToActive = getCookie('time_disabled_phone_verification');
            }
            
            $timeBlock.attr('data-time-left-verify', timeToActive);

            clearIntervalModalTimer();
            intervalModificatorModalTimer = showTimerButton($timeBlock, function (_$timeBlock) {                
                $buttonResend.removeAttr("data-tooltip");
            });
            $buttonResend.attr("data-tooltip", $button.attr('data-text-tooltip-wait'));
        }

        $("#ModalVerifyPhone [data-phone-text]").html($button.attr('data-full-phone-number'));
        $("#ModalVerifyPhone [data-count-attempts]").text($button.attr('data-count-verify-attempts'));
        $("#ModalVerifyPhone [data-text-no-attemps-resend]").hide();
        $("#ModalVerifyPhone [data-text-no-attemps-for-one-code]").hide();
        if (!$("#ModalVerifyPhone").hasClass('in')) {
            $("#ModalVerifyPhone").modal('show');
        }

    } else {

        counter_submit_code.phone = 0;
        counter_submit_code.alt_phone = 0;
        $('#ModalVerifyPhone').find('input[name="code"]').prop('disabled', false).change();

        submit_recend_phone_code = true;
        callAjax('json', urlVerification, function (data) {

            submit_recend_phone_code = false;

            if (data.result == true) {

                $button.attr('data-count-verify-attempts', $button.attr('data-count-verify-attempts') - 1);

                if ($button.attr('data-count-verify-attempts') <= 0) {
                    $button.prop("disabled", true);
                    $button.attr("data-tooltip", $button.attr('data-text-tooltip'));

                    modal.find('[data-text-resend]').hide();
                    modal.find('[data-text-no-resend]').show();

                } else {

                    var $timeBlock = modal.find('[data-time-block-verify]');
                    var $timeBlockInButton = $button.find('[data-time-block-verify]');
                    var durationTime = (3 * 60);
                    var timeToActive = Math.floor(Date.now() / 1000) + durationTime;

                    modal.find('[data-text-resend]').show();
                    modal.find('[data-text-no-resend]').hide();

                    if ($buttonResend.attr('data-type-row') == 'alt_phone') {
                        setCookie('time_disabled_alt_phone_verification', timeToActive, durationTime);
                    } else {
                        setCookie('time_disabled_phone_verification', timeToActive, durationTime);
                    }

                    $timeBlock.attr('data-time-left-verify', timeToActive);
                    $timeBlockInButton.attr('data-time-left-verify', timeToActive);
                    
                    clearIntervalModalTimer();
                    intervalModificatorModalTimer = showTimerButton($timeBlock, function (_$timeBlock) {
                        $buttonResend.removeAttr("data-tooltip");
                    });

                    showTimerButton($timeBlockInButton, function (_$timeBlock) {
                        $button.removeClass($button.attr("data-class-disabled-wait"))
                                .removeAttr("data-tooltip");
                    });

                    $button.addClass($button.attr("data-class-disabled-wait"));
                    $buttonResend.attr("data-tooltip", $button.attr('data-text-tooltip-wait'));

                }

                $("#ModalVerifyPhone [data-phone-text]").html($button.attr('data-full-phone-number'));
                $("#ModalVerifyPhone [data-count-attempts]").text($button.attr('data-count-verify-attempts'));
                $("#ModalVerifyPhone [data-text-no-attemps-resend]").hide();
                $("#ModalVerifyPhone [data-text-no-attemps-for-one-code]").hide();
                if (!$("#ModalVerifyPhone").hasClass('in')) {
                    $("#ModalVerifyPhone").modal('show');
                }
            }
        });
    }
});


var submit_verify_phone = false;
$(document).on('submit', '#ModalVerifyPhone [data-verification-code-form]', function (event) {

    event.preventDefault();
    event.stopPropagation();
    
    if(submit_verify_phone){
        return false;
    }
    

    var $form = $(this);
    var error_block = $form.find('[data-error-block]');
    
    //validation
    if($form.find('input[name="code"]').prop('disabled')){
        return false;
    } else if ($form.find('input[name="code"]').val().length == 9) {
        $form.find('input[name="code"]').removeClass('invalid-input');
        error_block.hide();
    } else {
        $form.find('input[name="code"]').addClass('invalid-input');
        error_block.html(error_block.attr('data-text-wrong-length'));
        error_block.show();
        return false;
    }      
    
    $form.find('[data-submit-form]').find('.sk-fading-circle').show();
    
    //alt_phone or phone
    if ($form.closest('.modal').find('[data-resend-code]').attr('data-type-row') == 'alt_phone') {
        var url = '/verification?ajax=altphoneVerification';
        var countAvailableAttempts = $("[data-verify-alt-phone] [data-verify-button]").attr('data-count-verify-attempts');
        var count_submitting  = ++counter_submit_code.alt_phone;
    } else {
        var countAvailableAttempts = $("[data-verify-phone] [data-verify-button]").attr('data-count-verify-attempts');
        var url = '/verification?ajax=phoneVerification';  
        var count_submitting  = ++counter_submit_code.phone;
    }

    submit_verify_phone = true;
    
    callAjax('json', url, function (data) {
        
        submit_verify_phone = false;

        $form.find('[data-submit-form]').find('.sk-fading-circle').hide();

        if (data.result == true) {

            error_block.hide();
            $form.find('input[name="code"]').removeClass('invalid-input');
            
            $("[data-banner-phone-not-verified]").hide();

            $form.closest('.modal').modal('hide');
            $("#ModalPhoneVerificationSuccess").modal('show');
            $("#ModalPhoneVerificationSuccess").on('hide.bs.modal', function () {
                redirect('/settings');
            });
            
        } else { 
            
            error_block.html(error_block.attr('data-text-wrong-code'));
            $form.find('input[name="code"]').addClass('invalid-input');
            error_block.show();

            if (count_submitting >= 3) {//for one code there are 3 attemps to submit 
                $form.find('input[name="code"]').prop('disabled', true);
                $form.find('[data-submit-form="1"]').addClass('submit_btn-disabled');

                if (countAvailableAttempts <= 0) {
                    $("#ModalVerifyPhone [data-text-resend]").hide();
                    $("#ModalVerifyPhone [data-text-no-attemps-resend]").show();
                } else {
                    $("#ModalVerifyPhone [data-text-no-attemps-for-one-code]").show();
                }
            }  
                       
        }
    }, $form.serialize(), $form);

    return false;

});

$(document).on('click', '[data-form-timezone] [data-submit-form]', function (event) {
    event.preventDefault();
    event.stopPropagation();

    var $form = $(this).closest('form');

    var data = {
        timezone_value: $form.find('select[name="timezone"]').val()
    };

    $form.find('[data-submit-form]').find('.sk-fading-circle').show();

    callAjax("json", "/settings?ajax=ChangeTimezone", function (data) {
        $form.find('[data-submit-form]').find('.sk-fading-circle').hide();
        if (typeof (data.result.result) !== "undefined" && data.result.result === true) {
            redirect('/settings');
        }
    }, data, $form);
});


$(document).on('click', '#writer_change_city [data-submit-form]', function (event) {
    event.preventDefault();
    event.stopPropagation();

    var $form = $(this).closest('form');
    if (!$form.valid()) {
        return false;
    }

    $form.find('[data-submit-form]').find('.sk-fading-circle').show();
    callAjax("json", "/settings?ajax=ChangeCity", function (data) {
        $form.find('[data-submit-form]').find('.sk-fading-circle').hide();
        if (typeof (data.result.result) !== "undefined" && data.result.result === true) {
            redirect('/settings');
        }
    }, $form.serialize(), $form);
});

$(document).on('change', '#writer_change_country select[name="country"]', function (event) {

    var country = $(this);
    var $form = country.closest('form');

    if (country.val() != country.attr('data-current-country-code')) {
        $form.closest('[data-block-country]').find('.edit-help-text.mt-3').show();
    } else {
        $form.closest('[data-block-country]').find('.edit-help-text.mt-3').hide();
    }
});

$(document).on('click', '#writer_change_country [data-submit-form]', function (event) {
    event.preventDefault();
    event.stopPropagation();

    var $form = $(this).closest('form');
    if (!$form.valid()) {
        return false;
    }
    $form.find('[data-submit-form]').find('.sk-fading-circle').show();
    callAjax("json", "/settings?ajax=ChangeCountry", function (data) {
        if (typeof (data.result.result) !== "undefined" && data.result.result === true) {
            redirect('/settings');
        }
    }, $form.serialize(), $form);
});

$(document).on('click', '.change-pass-setting', function () {
    $(this).hide();
    $(this).parents('.order-details-block').find('.order-option').hide();
    $(this).parents('.order-details-block').find('.alert-grey').fadeIn(300);
});

$(document).on('click', '.settings-det-password [data-sett-cancel]', function () {
    $(this).parents('form').find('input').val('').removeClass('alert-control');
    $(this).parents('.order-details-block').find('.alert-grey').hide();
    $(this).parents('.order-details-block').find('.order-option, .change-pass-setting').fadeIn(300);
});

$(document).on('input', '[data-password-field]', function () {
    $(this).parent().find(".show-password").show();
});

$(document).on('click', '.show-password', function () {
    var input = $(this).parent().find("[data-password-field]"),
            type_input = input.attr("type");
    if (type_input == "password") {
        input.attr('type', 'text');
        $(this).addClass("hide-password");
    } else {
        input.attr('type', 'password');
        $(this).removeClass("hide-password");
    }
});

function matchPassword($PassInput) {
    return $PassInput.val().match(/^[a-zA-Z0-9_:;,.@$!?#%&*()+=\[\]\{\}"]{6,}$/g);
}

$(document).on('input', '[data-form-writer-change-password] input[name="current_password"], [data-form-writer-change-password] input[name="new_password"], [data-form-writer-change-password] input[name="new_password_check"]', function (event) {
    var form = $('[data-form-writer-change-password]');

    //button submit active disabled
    if (form.find('input[name="current_password"]').val() == ''
            || form.find('input[name="new_password"]').val().length < 6
            || form.find('input[name="new_password_check"]').val().length < 6) {
        form.find('[data-submit-form]').addClass('submit_btn-disabled');
    } else {
        form.find('[data-submit-form]').removeClass('submit_btn-disabled');
    }

    //remove errors from inputs
    if (($(this).attr('name') == 'new_password' || $(this).attr('name') == 'new_password_check')
            && form.find('input[name="new_password"]').val() != '' && form.find('input[name="new_password_check"]').val() != ''
            ) {
        form.find('input[name="new_password"]').removeClass('alert-control error').closest('.block_element').find('.alert-required').hide().text('');
        form.find('input[name="new_password_check"]').removeClass('alert-control error').closest('.block_element').find('.alert-required').hide().text('');
    } else {
        $(this).removeClass('alert-control error').closest('.block_element').find('.alert-required').hide().text('');
    }
});

$(document).on('click', '[data-form-writer-change-password] [data-submit-form]', function (event) {
    event.preventDefault();
    event.stopPropagation();

    var form = $(this).closest('form');
    var isValid = true;
    var currentPassword = form.find('input[name="current_password"]');
    var newPassword = form.find('input[name="new_password"]');
    var newCheckPassword = form.find('input[name="new_password_check"]');

    form.find('[data-text-error-empty]').each(function () {
        var input = $(this);
        if (input.val() == '') {
            input.addClass('alert-control').closest('.block_element').find('.alert-required').show().text(input.attr('data-text-error-empty'));
            isValid = false;
        } else {
            input.removeClass('alert-control').closest('.block_element').find('.alert-required').hide().text('');
        }
    });
    if (!isValid) {
        return false;
    }

    form.find('[data-text-error-not-valid]').each(function () {
        var input = $(this);
        if (!matchPassword(input)) {
            input.addClass('alert-control').closest('form').find('[data-block-error-not-valid]').show().text(input.attr('data-text-error-not-valid'));
            isValid = false;
        } else {
            input.removeClass('alert-control').closest('form').find('[data-block-error-not-valid]').hide().text('');
        }
    });
    if (!isValid) {
        return false;
    }

    if (newPassword.val() != newCheckPassword.val()) {
        newPassword.addClass('alert-control');
        newCheckPassword.addClass('alert-control').closest('form').find('[data-block-error-do-not-match]').show().html(newCheckPassword.attr('data-text-error-do-not-match'));
        isValid = false;
    } else {
        newPassword.removeClass('alert-control');
        newCheckPassword.removeClass('alert-control').closest('form').find('[data-block-error-do-not-match]').hide().text('');
    }
    if (!isValid) {
        return false;
    }

    if (currentPassword.val() == newPassword.val()) {
        newPassword.addClass('alert-control');
        newCheckPassword.addClass('alert-control').closest('form').find('[data-block-error-cannot-match-current]').show().html(newCheckPassword.attr('data-text-error-cannot-match-current'));
        isValid = false;
    } else {
        newPassword.removeClass('alert-control');
        newCheckPassword.removeClass('alert-control').closest('.block_element').find('[data-block-error-cannot-match-current]').hide().text('');
    }
    if (!isValid) {
        return false;
    }

    form.find('[data-submit-form]').find('.sk-fading-circle').show();

    callAjax('json', '/settings?ajax=changePassword', function (data) {
        form.find('[data-submit-form]').find('.sk-fading-circle').hide();
        if (data.result.result == 1) {
            redirect('/settings');
        } else if (typeof data.result.custom_error !== 'undefined' && typeof data.result.custom_error.new_password_check !== 'undefined') {
            newPassword.addClass('alert-control');
            newCheckPassword.addClass('alert-control').closest('form').find('[data-block-error-do-not-match]').show().html(data.result.custom_error.new_password_check);
        }
    }, form.serialize(), form);
});





$(document).on('click', '#writer_change_name [data-submit-form]', function (event) {
    if($("#writer_change_name .alert-required").length){
        return false;
    }
    event.preventDefault();
    event.stopPropagation();

    var form = $(this).closest('form');

    callAjax('json', '/settings?ajax=nameChange', function (data) {
        form.find('[data-submit-form]').find('.sk-fading-circle').hide();
            location.reload();
    }, form.serialize(), form);
});



$(document).on('click', '#writer_change_surname [data-submit-form]', function (event) {
    if($("#writer_change_surname .alert-required").length){
        return false;
    }
    
    event.preventDefault();
    event.stopPropagation();

    var form = $(this).closest('form');

    callAjax('json', '/settings?ajax=surnameChange', function (data) {
        form.find('[data-submit-form]').find('.sk-fading-circle').hide();
            location.reload();
    }, form.serialize(), form);
});




$(document).on('click', '#ModalForgotPass [data-submit-modal]', function () {
    var email = $(this).attr('data-email');
    callAjax('json', '/password_restore?ajax=sendMail', function () {
        $('#ModalForgotPass').modal('hide');
    }, {'email': email});
});

$("#ModalIdentityProof").on("show.bs.modal", function () {
    var count_upload_files = $('[data-target="#ModalIdentityProof"]').attr('data-count-download-files');
    if (count_upload_files) {
        UploadIdentyProof.limitFiles = 3 - count_upload_files;
    }
});

//posible-count-upload-files
$(document).on('change', '#ModalIdentityProof [data-form-identity-proof] [name="files[]"]', function () {
    UploadIdentyProof.preloadFiles($(this)[0].files);
});

$(document).on('click', '#ModalIdentityProof [data-submit-modal]', function () {
    if (!UploadIdentyProof.checkFiles()) {
        return false;
    }
    UploadIdentyProof.uploadFiles($(this).closest('form'));
});

var UploadIdentyProof = {
    limitFiles: 3,
    uploaded_files_list: {},
    files_left_to_upload: null,
    dragDropFile: function (e) {
        if (Object.keys(UploadIdentyProof.uploaded_files_list).length < UploadIdentyProof.limitFiles) {
            UploadIdentyProof.preloadFiles(e.dataTransfer.files);
        }
        return false;
    },
    updateFileUploadProcess: function (file_tmp_name) {
        var file_block = $("#ModalIdentityProof .fileload-item[data-file-temp-name='" + file_tmp_name + "']");
        var current_status = parseInt(file_block.find('.file_load_progress').attr('aria-valuenow'));

        // calculate what part of file can be uploaded in 1/20 of second
        var step_for_progress = 1 / (UploadIdentyProof.uploaded_files_list[file_tmp_name].size / (internet_speed.value.bytes / 20 /* speed for 1/20 sec */));

        if (step_for_progress > 1) {
            file_block.find('.file_load_progress').attr('aria-valuenow', '100')
                    .find('.progress-bar').css('width', '100%');
        } else {
            var new_status = current_status + (step_for_progress * 100);

            new_status = new_status > 100 ? 100 : new_status;

            file_block.find('.file_load_progress').attr('aria-valuenow', new_status)
                    .find('.progress-bar').css('width', new_status + '%');

        }
    },
    uploadFiles: function (form) {
        form.find('[data-submit-modal]').find('.sk-fading-circle').show();

        UploadIdentyProof.files_left_to_upload = Object.keys(UploadIdentyProof.uploaded_files_list).length;

        $.each(UploadIdentyProof.uploaded_files_list, function (file_tmp_name, file_data) {
            var form_data = new FormData();
            form_data.append('file_tmp_name', file_tmp_name);
            form_data.append('files[]', file_data);

            var file_block = $("#ModalIdentityProof .fileload-item[data-file-temp-name='" + file_tmp_name + "']");

            file_block.find('.file-load-cancel, .file_load_size').fadeOut(100, function () {
                file_block.find('.file_load_progress').fadeIn(100);
            });

            UploadIdentyProof.uploaded_files_list[file_tmp_name].interval = setInterval(UploadIdentyProof.updateFileUploadProcess, 50, file_tmp_name); // 1/20 part of secont

            $.ajax({
                url: 'settings?ajax=uploadIdentityProof', // point to server-side PHP script
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,
                method: 'POST',
                type: 'POST',
                success: function (data) {
                    clearInterval(UploadIdentyProof.uploaded_files_list[file_tmp_name].interval);
                    UploadIdentyProof.uploaded_files_list[file_tmp_name].interval = false;

                    file_block.find('.file_load_progress').fadeOut(100, function () {
                        file_block.find('.upload-done-icon, .file_load_size').fadeIn(100);
                    });

                    UploadIdentyProof.files_left_to_upload--;
                    if (UploadIdentyProof.files_left_to_upload === 0) {
                        form.find('[data-submit-modal]').find('.sk-fading-circle').hide();
                        redirect('/settings');
                        setTimeout(function () {
                            UploadIdentyProof.clearModal();
                        }, 1000);
                    }
                },
                error: function (data) {}
            });
        }
        );
    },
    clearModal: function () {
        UploadIdentyProof.uploaded_files_list = {};
        var modal = $("#ModalIdentityProof");
        modal.modal('hide');
        modal.find(".modal-body > .attachment-error.error-type").hide();
        modal.find(".drop-files--extended__container").removeClass('disabled-upload');
        modal.find(".modal-body .attachment-error.error-count").hide();
        modal.find(".error-files").empty();
        modal.find(".valid-files").empty();
        modal.find("[data-submit-modal]").addClass('submit_btn-disabled');

    },
    checkFiles: function () {
        var check = true;

        if (Object.keys(UploadIdentyProof.uploaded_files_list).length == 0) {
            check = false;
        }

        //validate files
        var error_uploaded_files = $("#ModalIdentityProof .fileload-container .error-files .fileload-item");
        $("#ModalIdentityProof .drop-files--extended__container").removeClass("error");
        if (error_uploaded_files.length > 0) {
            $("#ModalIdentityProof .modal-body > .attachment-error.error-type").show();
            check = false;
        } else {
            $("#ModalIdentityProof .modal-body > .attachment-error.error-type").hide();
        }

        //validate posibility to upload files
        if (Object.keys(UploadIdentyProof.uploaded_files_list).length >= UploadIdentyProof.limitFiles) {
            $("#ModalIdentityProof .drop-files--extended__container").addClass('disabled-upload');
        } else {
            $("#ModalIdentityProof .drop-files--extended__container").removeClass('disabled-upload');
        }

        //validate count files
        if (Object.keys(UploadIdentyProof.uploaded_files_list).length > UploadIdentyProof.limitFiles) {
            $("#ModalIdentityProof .modal-body .attachment-error.error-count").show();
            check = false;
        } else {
            $("#ModalIdentityProof .modal-body .attachment-error.error-count").hide();
        }

        //button submit
        if (check) {
            $("#ModalIdentityProof [data-submit-modal]")
                    .removeClass('submit_btn-disabled');
        } else {
            $("#ModalIdentityProof [data-submit-modal]")
                    .addClass('submit_btn-disabled');
        }

        return check;
    },

    removeTmpMessageFile: function () {
        var button = $(this),
                file_block = button.parent().closest('.fileload-item');

        delete UploadIdentyProof.uploaded_files_list[file_block.attr('data-file-temp-name')];

        file_block.slideUp(200, function () {
            $(this).detach();

            UploadIdentyProof.checkFiles();
        });
    },

    preloadFiles: function (pre_files) {
        if (!pre_files.length) {
            return false;
        }
        var parsed_html_data = {
            error_block: "",
            valid_block: ""
        };

        $.each(
                pre_files,
                function (iter, file_data) {

                    var file_name = file_data.name,
                            file_name_transl = rus_to_latin(file_name),
                            tmp_file_name = Date.now() + '---' + Base64.encode(file_name_transl);

                    var valid_ext = checkFileExtension(file_name);

                    file_data.name = file_name_transl;
                    file_data.interval = false;
                    if (MAX_FILESIZE > file_data.size && valid_ext) {
                        UploadIdentyProof.uploaded_files_list[tmp_file_name] = file_data;
                    }

                    var validation_errors = {
                        file_size_error: MAX_FILESIZE < file_data.size ? 'File size exceeds 50 Mb' : false,
                        extension_error: valid_ext ? false : 'Wrong file format. Use ZIP.'
                    };

                    var file_size_data = parseBytes(file_data.size);

                    var jSmartyObject = new jSmart($("#identity_proof_file_item")[0].innerHTML);
                    var current_html = jSmartyObject.fetch({
                        in_development: in_development,
                        file_data_tmp_name: tmp_file_name,
                        remove_function_name: 'UploadIdentyProof.removeTmpMessageFile.call(this)',
                        file_data: {
                            name: file_name_transl,
                            cropped_name: croppString(file_name_transl, 25, 7),
                            size: file_size_data.size + " " + file_size_data.size_type
                        },
                        validation_error: validation_errors.file_size_error ?
                                validation_errors.file_size_error
                                : (
                                        validation_errors.extension_error ?
                                        validation_errors.extension_error
                                        : false
                                        )
                    });

                    if (MAX_FILESIZE < file_data.size || !valid_ext) {
                        parsed_html_data.error_block += current_html;
                    } else {
                        parsed_html_data.valid_block += current_html;
                    }
                }
        );

        $("#ModalIdentityProof .fileload-container .error-files").append(parsed_html_data.error_block);
        $("#ModalIdentityProof .fileload-container .valid-files").append(parsed_html_data.valid_block);

        UploadIdentyProof.checkFiles();

        $("#ModalIdentityProof #files_input").val('');
    }
}

/**
 END personal info
 */

/*Payment details TAB*/

$(document).on('click', '[data-add-alt-payment], [data-add-main-payment]', function () {
    $(this).hide();
    $('.set-payment-method').show();
})

$(document).on('click', '[data-setup-payment]', function () {
    const payMethod = $(this).data('setup-payment');
    $("#TransferMethodUI_" + payMethod).empty();

    if ([10, 11, 12].includes(payMethod)) {
        
        
        
        const accountType = {
                10: 'PAYPAL_ACCOUNT',
                11: 'BANK_ACCOUNT',
                12: 'WIRE_ACCOUNT'
        }
        
        console.log(99779977);
        
        callAjax('json', '/my_balance?ajax=GetHWUserToken', function (data) {
            
            console.log(data.response);
            const response = data.response;
            const transferMethodConfiguration = {
                //"country": "US", 
                //"currency": "USD", 
                //"type": accountType[payMethod], 
                //"profileType": "INDIVIDUAL" 
            };


            if (response.errors) {
                $("#hw_error").text(response.message);
                $("#hw_error").show();
                return false;
            }


            
            const accountTypeNew = {
                10: 'paypal-account',
                11: 'bank-account',
                12: 'wire-account'
            }

            $.getScript(response.src, function () {
                console.log(2222);
                console.log(payMethod);
                console.log(accountTypeNew[payMethod]);
                console.log(3333);
                
                
                HWWidgets.initialize((onSuccess, onFailure) => {
                    onSuccess(response.token);
                });


                console.log("after HWWidgets.initialize");

                $("#user_payment_details_row").hide();
                $("#user_number_account_holder_row").hide();

                let skipProfileFieslds = true; 
                if([10, 11].includes(payMethod) && CURRENT_USER.country == 'PK'){
                    skipProfileFieslds = false;
                }
                
                HWWidgets.transferMethods.configure({
                    "template": "bootstrap3",
                    "el": document.getElementById("TransferMethodUI_" + payMethod),
                    "type": accountTypeNew[payMethod]
                }).create(transferMethodConfiguration);
                
                
                /*HWWidgets.events.on("widget:loading:shown", () => {
                    
                });*/

                HWWidgets.events.on("widget:loading:hidden", () => {
                    $("#TransferMethodUI_" + payMethod).closest('.payment-box-colapse').find('.sk-fading-circle').hide();
                    setTimeout(function(){
                         $("#hw-widget-selection-step-tmc-selection-form-addTransferMethodHeader").text('Available options depend on your country of residence');
                         $('#transferMethodTypeList').prepend("<p>Select one of the vailable option:</p>");
                    }, 50);
                   
                });
                
                
                // Example of a completed event
                HWWidgets.events.on("widget:transfermethods:completed", (trmObject, completionResult) => {
                    
                    console.log(trmObject);
                    console.log(completionResult);
                  // redirect payee to another page with the result and token
                  var paymentObj = {
                        'user_token': trmObject.userToken,
                        'profile_token': trmObject.token,
                        'profile_type': trmObject.type,
                        'account_holder': trmObject.firstName + ' ' + trmObject.lastName,
                        //'method': payMethod,
                        'alternative': altPayment,
                        };

                        if (trmObject.type == 'PAYPAL_ACCOUNT') {
                            paymentObj['email'] = trmObject.email;
                            paymentObj['country'] = trmObject.transferMethodCountry;
                            paymentObj['method'] = 10;
                        }

                        if (trmObject.type == 'BANK_ACCOUNT' || trmObject.type == 'WIRE_ACCOUNT') {
                            paymentObj['currency'] = trmObject.transferMethodCurrency;
                            paymentObj['country'] = trmObject.transferMethodCountry;
                            paymentObj['account_number'] = trmObject.bankAccountId;
                        }
                        
                        if (trmObject.type == 'BANK_ACCOUNT') {
                            paymentObj['method'] = 11;
                        }
                        if (trmObject.type == 'WIRE_ACCOUNT') {
                            paymentObj['method'] = 12;
                        }

                        callAjax('json', '/my_balance?ajax=SubmitHWUserAccount', function (data) {
                            if (data.response.ok == 'ok') {
                                location.reload();
                            }
                        }, paymentObj);
                });
                

                  
                  
                  
                /*
                 HWWidgets.transferMethods.configure({
                    "template": "bootstrap3",
                    "el": document.getElementById("TransferMethodUI_" + payMethod),
                    "skipProfileFields": skipProfileFieslds,
                    "transferMethodConfiguration": {
                        "type": accountType[payMethod]
                    },
                    "onLoading": function () {
                        $("#TransferMethodUI_" + payMethod).closest('.payment-box-colapse').find('.sk-fading-circle').hide()
                    },
                    "onComplete": function (trmObject, completionResult) {
                        var paymentObj = {
                            'user_token': trmObject.userToken,
                            'profile_token': trmObject.token,
                            'profile_type': trmObject.type,
                            'account_holder': trmObject.firstName + ' ' + trmObject.lastName,
                            'method': payMethod,
                            'alternative': altPayment,
                        };

                        if (trmObject.type == 'PAYPAL_ACCOUNT') {
                            paymentObj['email'] = trmObject.email;
                            paymentObj['country'] = trmObject.transferMethodCountry;
                        }

                        if (trmObject.type == 'BANK_ACCOUNT' || trmObject.type == 'WIRE_ACCOUNT') {
                            paymentObj['currency'] = trmObject.transferMethodCurrency;
                            paymentObj['country'] = trmObject.transferMethodCountry;
                            paymentObj['account_number'] = trmObject.bankAccountId;
                        }

                        callAjax('json', '/my_balance?ajax=SubmitHWUserAccount', function (data) {
                            if (data.response.ok == 'ok') {
                                location.reload();
                            }
                        }, paymentObj);
                    },
                    "onError": function (errors, state) {

                    }
                }).display(function () {
                });
                */
            });
        }, {})
    }
    $(this).parents('.payment-box').toggleClass('payment-box-active').siblings('.payment-box').removeClass('payment-box-active');
    $(this).parents('.payment-box').removeClass('payment-box-dissabled').siblings('.payment-box').addClass('payment-box-dissabled');
});

$(document).on('click', '.btn-close-active', function () {
    $("#ModalDiscardChanges").modal('show');
});

$(document).on('click', '#ModalDiscardChanges button[type="submit"]', function () {
    $(this).parents('.payment-box').removeClass('payment-box-active');
    $(this).parents('.payment-box').siblings('.payment-box').not('.filled').removeClass('payment-box-dissabled');
});

$(document).on('click', '#ModalDiscardChanges button[type="submit"]', function () {
    $(this).parents('.payment-box').removeClass('payment-box-active');
    $(this).parents('.payment-box').siblings('.payment-box').not('.filled').removeClass('payment-box-dissabled');
});

$(document).on('submit', '.validated_form', function (e) {
    e.preventDefault();
    const form = $(this);
    const method = form.find('input[name="payment_method"]').val();
    let valid = true;

    form.find('.error').removeClass('error');
    form.find('.alert-hint').hide();

    // if(['4','5'].includes(method)) {
    //
    // }

    const accountHolder = form.find('input[name="account-holder"]');
    const checkConfirm = form.find(".form-check-input");
    let accountDetails = '';
    
    if (!(accountHolder.val().match(/[\w\s]+/) && accountHolder.val().trim().split(' ').length >= 2)) {
        accountHolder.addClass('error');
        accountHolder.closest('.input-form').find('.alert-hint').show();
        valid = false;
    }

    if (!checkConfirm.is(':checked')) {
        checkConfirm.addClass('error');
        checkConfirm.closest('.form-group').find('.alert-hint').show();
        valid = false;
    }

    if (method == 6) {
        const wmzNumber = form.find('input[name="wmz-purse-number"]');
        if (wmzNumber.val().length == 0) {
            wmzNumber.addClass('error');
            wmzNumber.closest('.input-form').find('.alert-hint.empty').show();
            wmzNumber.closest('.input-form').find('.alert-hint.wrong-symbols').hide();
            valid = false;
        } else if (!wmzNumber.val().match(/^Z\d{12}$/)) {
            wmzNumber.addClass('error');
            wmzNumber.closest('.input-form').find('.alert-hint.wrong-symbols').show();
             wmzNumber.closest('.input-form').find('.alert-hint.empty').hide();
            valid = false;
        }
        accountDetails = wmzNumber.val();
    }

    if (valid) {
        const paymentRequest = {
            'pay_method': method,
            'pay_details': accountDetails,
            'pay_account_holder': accountHolder.val(),
            'alt_payment': altPayment
        }
        form.find('.c-submit-btn').hide();
        form.find('.sk-fading-circle').show();
        form.find('.c-process-btn').show();
        callAjax('json', '/settings?ajax=SubmitPayMethod', function (data) {
            if (data.result.payonners_url) {
                window.location.href = data.result.payonners_url;
            }

            if (data.result.ok && data.result.ok == 'ok') {
                location.reload()
            }
        }, paymentRequest)
    }
})

$("#ModalBillingDetails").find('input, select').on('change keyup', function () {
    $("#ModalBillingDetails").find('.submit_btn').removeClass('submit_btn-disabled');
})
// $("#ModalBillingDetails").find('input, select').on('change keyup', function () {
//     validateField($(this));
// })
//
// $("#ModalBillingDetails").find('input').on('focusout', function () {
//     validateField($(this));
// });

$("#ModalBillingDetails").find('form').on('submit', function (e) {
    e.preventDefault();
    validateBillingForm();
    if (!$(this).find('.submit_btn').hasClass('submit_btn-disabled')) {
        callAjax('json', '/profile?ajax=Update', function (data) {
            if (data.result == 1) {
                location.reload();
            }
        }, $(this).serialize());
    }
})

function validateBillingForm()
{
    let valid = true;
    const button = $("#ModalBillingDetails").find('.submit_btn');

    if (!button.hasClass('submit_btn-disabled')) {
        button.addClass('submit_btn-disabled')
    }
    $("#ModalBillingDetails").find('input').each(function () {
        valid = validateField($(this));
        if(!valid) {
            return false;
        }
    });
    
    if (valid) {
        button.removeClass('submit_btn-disabled')
    }
}

function validateField(field) {
    valid = true;
    let errorMessage = '';
    field.closest('.col').find('.alert-required').hide();
    field.removeClass('error');

    if (!field.val().replace(/[\s]+/g, '').match(/[^а-яА-Я]{3,}/)) {
        valid = false;
        errorMessage = 'Please enter a valid value';
    }

    if (field.val().match(/[а-яА-Я]+/)) {
        valid = false;
        errorMessage = 'Please use only latin characters';
    }

    if (errorMessage && !valid) {
        field.closest('.col').find('.alert-required').text(errorMessage).show();
        field.addClass('error');
    }
    return valid;
}
/*END Payment details TAB*/

/* Notifications TAB */
var telegramNotifTimer = false;
$(document).on('change', '[name="invites_enadled"]', function () {
    var updates = {
        invites_enadled: $(this).val()
    };
    callAjax('json', '/profile?ajax=UpdateAdditionalInfo', function (data, isError) {}, {updates});
});

$(document).on('change', '[name="sms-notifications"]', function () {
    var is_checked = $(this).is(':checked');
    callAjax('json', '/profile?ajax=UpdateReceiveSms', function (data) {}, {value: is_checked ? 1 : 0});
});

$('#all-notifications, #active-orders-notifications, #urgent-matters-notifications').on('click', function (e) {
    if (!$(this).is(":checked")) {
        e.preventDefault();
        return false;
    }
});

$('#all-notifications, #active-orders-notifications, #urgent-matters-notifications').on('change', function (e) {
    clearTimeout(telegramNotifTimer);
    if ($('#active-orders-notifications').is(':checked') && $('#urgent-matters-notifications').is(':checked')) {
        setTimeout(function () {
            $('#active-orders-notifications, #urgent-matters-notifications').prop('checked', false);
            $('#all-notifications').prop('checked', true);
        }, 150);
    }

    if ($('#all-notifications').is(':checked') && ($('#active-orders-notifications').is(':checked') || $('#urgent-matters-notifications').is(':checked'))) {
        if ($(this).attr('id') != 'all-notifications') {
            $('#all-notifications').prop('checked', false);
        } else {
            $('#active-orders-notifications, #urgent-matters-notifications').prop('checked', false);
        }
    }
    telegramNotifTimer = setTimeout(function () {
        var notif_val = $('#all-notifications:checked, #active-orders-notifications:checked, #urgent-matters-notifications:checked').val();
        callAjax('json', '/profile?ajax=UpdateNotifTelegram', function (data) {}, {'notif': notif_val});
    }, 1000)
});

/* END Notifications TAB */

/*END SETTINGS PAGE JS*/

/*VERIFY PHONE MODAL*/

window.addEventListener('DOMContentLoaded', function () {
    if ($("#ModalVerifyPhoneActivation").attr('data-is-show-modal-verify-phone') == '1') {
        //showModalVerifyPhone();
        console.log(12);
    }
});

$(document).on('click', '#ModalVerifyPhoneActivation [data-open-verify]', function () {
    $(this).closest('.modal').find('[data-call-formphone]').hide();
    $(this).closest('.modal').find('[data-phone-preview]').hide();
    $(this).closest('.modal').find('[data-show-formverif]').fadeIn(300);
});

$(document).on('click', '#ModalVerifyPhoneActivation [data-open-preview]', function () {
    $(this).closest('.modal').find('[data-phone-preview]').fadeIn(300);
    $(this).closest('.modal').find('[data-call-formphone]').hide();
    $(this).closest('.modal').find('[data-show-formverif]').hide();
});

$(document).on('click', '#ModalVerifyPhoneActivation [data-open-edit]', function () {
    $(this).closest('.modal').find('[data-call-formphone]').fadeIn(300);
    $(this).closest('.modal').find('[data-phone-preview]').hide();
    $(this).closest('.modal').find('[data-show-formverif]').hide();
});

$(document).on('click', '#ModalVerifyPhoneActivation [data-modal-change-phone-button]', function () {
    $(this).parents('.grey-modal-inner').hide();
    $(this).parents().find('[data-call-formphone]').fadeIn(300);
});

$('#ModalVerifyPhoneActivation').on('hidden.bs.modal', function () {
    $('#ModalVerifyPhoneActivation').find('input[name="code"]').val('');
});

$(document).on('click', '[data-modal-verify-phone] [data-modal-verify-button], #ModalVerifyPhoneActivation [data-resend-code]', function (event) {
    event.preventDefault();
    event.stopPropagation();

    var $button = $('[data-modal-verify-phone] [data-modal-verify-button]');
    var modal = $("#ModalVerifyPhoneActivation");
    var $buttonResend = modal.find('[data-resend-code]');
    
    if ($button.length == 0 
            || $button.is(":disabled") 
            || $button.hasClass($button.attr("data-class-disabled-wait"))  
            || $button.attr('data-count-verify-attempts') <= 0) {
        return false;
    }

    callAjax('json', '/verification?ajax=resendPhoneVerificationCode', function (data) {
        if (data.result == true) {
            
            $button.attr('data-count-verify-attempts', $button.attr('data-count-verify-attempts') - 1);

            if ($button.attr('data-count-verify-attempts') <= 0) {
                $button.prop("disabled", true);
                $buttonResend.attr("data-tooltip", $button.attr('data-text-tooltip'));
                modal.find('[data-text-resend]').hide();
                modal.find('[data-text-no-resend]').show();
            } else {                               
                var $timeBlock = modal.find('[data-show-formverify]').find('[data-time-block-verify]');
                var durationTime = (3 * 60);
                var timeToActive = Math.floor(Date.now() / 1000) + durationTime;       
                
                modal.find('[data-text-resend]').show();
                modal.find('[data-text-no-resend]').hide();
                
                setCookie('time_disabled_phone_verification', timeToActive, durationTime);
                $timeBlock.attr('data-time-left-verify', timeToActive);
                
                showTimerButton($timeBlock, function (_$timeBlock) {
                    $button.removeClass($button.attr("data-class-disabled-wait"));
                    $buttonResend.removeAttr("data-tooltip");
                });

                $button.addClass($button.attr("data-class-disabled-wait"));
                $buttonResend.attr("data-tooltip", $button.attr('data-text-tooltip-wait'));
            }

            modal.find("[data-phone-number-text]").html($button.attr('data-full-phone-number'));
            modal.find("[data-count-attempts]").text($button.attr('data-count-verify-attempts'));

            modal.find('[data-phone-preview]').hide();
            modal.find('[data-call-formphone]').hide();
            modal.find('[data-show-formverify]').fadeIn(300);
        }
    });
});

$(document).on('submit', '#ModalVerifyPhoneActivation [data-verification-code-form]', function (event) {

    event.preventDefault();
    event.stopPropagation();

    var $form = $(this);
    var error_block = $form.find('[data-error-block]');
    if ($form.find('input[name="code"]').val().length == 9) {
        $form.find('input[name="code"]').removeClass('invalid-input');
        error_block.hide();
    } else {
        $form.find('input[name="code"]').addClass('invalid-input');
        error_block.html(error_block.attr('data-text-wrong-length'));
        error_block.show();
        return false;
    }

    $form.find('[data-submit-form]').find('.sk-fading-circle').show();

    var countAvailableAttempts = $("[data-modal-verify-phone] [data-modal-verify-button]").attr('data-count-verify-attempts');

    callAjax('json', '/verification?ajax=phoneVerification', function (data) {

        $form.find('[data-submit-form]').find('.sk-fading-circle').hide();
        if (data.result == true) {
            error_block.hide();
            $form.find('input[name="code"]').removeClass('invalid-input');
            $form.closest('.modal').modal('hide');
            if ($("[data-modal-verify-phone] [data-modal-verify-button]").attr('data-writer-status-active') == 1) {
                $("#ModalPhoneVerificationSuccess").modal('show');
            } else {
                $("#ModalPhoneSuccess").modal('show');
            }
            
            $("[data-banner-phone-not-verified]").hide();

            if ($('[data-name-loaded-page]').attr('data-name-loaded-page') == 'settings') {
                redirect('/settings');
            }
        } else {
            error_block.html(error_block.attr('data-text-wrong-code'));
            $form.find('input[name="code"]').addClass('invalid-input');
            error_block.show();
            if (countAvailableAttempts <= 0) {
                $("#ModalVerifyPhoneActivation [data-text-resend]").hide();
                $("#ModalVerifyPhoneActivation [data-text-no-attemps-resend]").show();
                if ($('[data-name-loaded-page]').attr('data-name-loaded-page') == 'settings') {
                    redirect('/settings');
                }
            }
        }
    }, $form.serialize(), $form);

    return false;
});

function initModalVerifyAfterEdit() {

    var modal = $("#ModalVerifyPhoneActivation");

    var textPhone = '+ (' + modal.find('#select-country-phone-modal').find('option:selected').text().replace('+', '') + ') ' + modal.find('form input[name="phone"]').val().replace(/\D/g, "");

    modal.find('[data-phone-number-text]').text(textPhone);

    modal.find('[data-modal-verify-button]')
            .attr('data-full-phone-number', textPhone)
            .attr('data-count-verify-attempts', 3)
            .attr('data-max-count-verify-attempts', 3)
            .attr("data-tooltip", '')
            .prop("disabled", false);

    modal.find('[data-phone-preview]').show();
    modal.find('[data-show-formverify]').hide();
    modal.find('[data-call-formphone]').hide();
}

function showModalVerifyPhone(current_user) {
    var current_user = current_user || false;
    var modal = $("#ModalVerifyPhoneActivation");

    if (modal.hasClass('show')) {
        return;
    }

    if (current_user) { //put data if content is loaded by ajax
        if (current_user.status != 40) {
            modal.find('[data-text-registration]').show();
            modal.find('[data-modal-change-phone-button]').show();
            modal.find('[data-ticket-modal-settings]').hide();
        } else {
            modal.find('[data-text-registration]').hide();
            modal.find('[data-modal-change-phone-button]').hide();
            modal.find('[data-ticket-modal-settings]').show();
        }

        //form
        modal.find('form input[name="phone"]').val(current_user.phone_without_prefix);
        modal.find('form select[name="country_code_phone"]').attr('data-attr-current-country', current_user.country);

        //text
        modal.find('[data-phone-number-text]').text('+ (' + current_user.phone_prefix + ') ' + current_user.phone_without_prefix);

        //button verify
        var buttonVerify = modal.find('[data-modal-verify-button]');
        buttonVerify
                .attr('data-full-phone-number', '+ (' + current_user.phone_prefix + ') ' + current_user.phone_without_prefix)
                .attr('data-count-verify-attempts', current_user.phone_verification_max - current_user.phone_verification_count)
                .attr('data-max-count-verify-attempts', current_user.phone_verification_max)
                .attr('data-writer-status-active', (current_user.status == 40));

        if (buttonVerify.attr('data-count-verify-attempts') <= 0) {
            buttonVerify.prop("disabled", true);
            buttonVerify.attr("data-tooltip", buttonVerify.attr('data-text-tooltip'));
        } else {
            buttonVerify.prop("disabled", false);
            buttonVerify.attr("data-tooltip", '');
        }
    }

    //blocks
    modal.find('[data-phone-preview]').show();
    modal.find('[data-show-formverify]').hide();
    modal.find('[data-call-formphone]').hide();

    //init form rows
    modal.find('#select-country-phone-modal').find('option[value="' + modal.find('#select-country-phone-modal').attr('data-attr-current-country') + '"]').prop('selected', true).parent().change();
    modal.find('form .alert-required').remove();
    formatPhoneNumber(modal.find('form input[name="phone"]'));
    modal.find('form input[name="phone"]').change().removeClass('invalid-input error');

    $("#ModalVerifyPhoneActivation [data-verification-code-form] input[name='code']").on('input change', function () {
        var $this = $(this);
        var onlySymb = $this.val().replace(/[^0-9a-zA-Z]/g, "");
        if (!onlySymb) {
            $this.val('');
            return false;
        }

        $this.removeClass('invalid-input error').parent().find('[data-error-block]').hide();

        //validation form
        $buttonSubmit = $this.closest('form').find('[data-submit-form="1"]');
        if (onlySymb.toString().length === 9) {
            $buttonSubmit.removeClass('submit_btn-disabled');
        } else {
            $buttonSubmit.addClass('submit_btn-disabled');
        }
        $this.val(onlySymb);
    });

    //init for validation
    validationFormByConfig($("#writer_change_phone_modal"), function ($form, $input) {
        validateButtonSubmit($form);
    }, function ($form, $input) {
        validateButtonSubmit($form);
    }, 'writer_change_phone');

    //show
    setTimeout(function () {
        validateButtonSubmit($("#writer_change_phone_modal"));
        modal.modal('show');
        callAjax("json", "/settings?ajax=modalVerifyPhoneShown", function () {});
    }, 1500);

}
/*END VERIFY PHONE MODAL*/


var distributionTextSymbols = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";

function delWrongSymbols(el) {
    var text = el.val();

    for (i = 0; i < text.length; i++) {
        if (distributionTextSymbols.indexOf(text[i]) == -1) {
            text = text.split(text[i]).join('');
        }
    }

    el.val(text);
}



$(document).on('keyup', '#writer_change_name input[type="text"], #writer_change_surname input[type="text"]', function (event) {

    //$('#writer_change_name input[type="text"], #writer_change_surname input[type="text"]').keyup(function () {
        $(this).removeClass('error').removeAttr('error');
        if($(this).parents('form').attr('id') == 'writer_change_name'){
            $(".edit_name").remove();
        }
        if($(this).parents('form').attr('id') == 'writer_change_surname'){
            $(".edit_surname").remove();
        }
    });
    

    
$(document).on('focusout', '#writer_change_name input[type="text"], #writer_change_surname input[type="text"]', function (event) {
   // $('#writer_change_name input[type="text"], #writer_change_surname input[type="text"]').focusout(function () {
        
        var formName = $(this).parents('form').attr('id');
        $(this).parent().parent().find('.submit_btn').removeClass('submit_btn-disabled');
        if(formName == 'writer_change_name'){
            $(".edit_name").remove();
        }else{
            $(".edit_surname").remove();
        }
        
        var addClassEdit ="";
        
        if(formName == 'writer_change_surname'){
            addClassEdit = 'edit_surname';
        }else{
            addClassEdit = 'edit_name';
        }
        
        if ($(this).val().match(/[а-яА-Я0-9$@$!%*?&#^_\"\s;+]/g)) {
           $(this).addClass('error').attr("error","Please use only latin characters");
           $(this).parent().append('<div class="alert-required '+addClassEdit+'">Please use only latin characters</div>');
           $(this).parent().parent().find('.submit_btn').addClass('submit_btn-disabled');
        }

        if($(this).val().trim().length < 2){
            $(this).addClass('error').attr("error","Please enter no less than 2 characters");
            $(this).parent().append('<div class="alert-required '+addClassEdit+'">Please enter no less than 2 characters</div>');
            $(this).parent().parent().find('.submit_btn').addClass('submit_btn-disabled');
        }
        
        if($(this).val().trim().length > 70){
           $(this).addClass('error').attr("error","Please enter no more than 70 characters");
           $(this).parent().append('<div class="alert-required '+addClassEdit+'">Please enter no more than 70 characters</div>');
           $(this).parent().parent().find('.submit_btn').addClass('submit_btn-disabled');
        }
        
        
    });

$(document).ready(function () {

    

    
 });
function getCookieParam(param_name) {
    var val;
    $.each(document.cookie.split("; "), function(key, value) {
        param = value.split('=');
        if (param[0] == param_name) {
            val = param[1];
        }
    })
    return (typeof(val) == "undefined") ? null : val;
}

$(document).ready(function () {
if(typeof CURRENT_USER == 'object') {
    RTN = {};

    RTN.WS = null;
    RTN.reconnects = 0;
    RTN.max_reconnects = 500;
    RTN.listeners = {};
    RTN.init = function(params){
            if(RTN.reconnects >= RTN.max_reconnects){
                    console.error('RTN: max reconnects riches');
                    return false;
            }
        if(typeof CURRENT_USER === 'object')
            try {
                    RTN.WS = new WebSocket('wss://web-socket.tools:8443');

                    RTN.WS.onopen    = function(msg) {
                            if(CURRENT_USER.id == 73716 ){
                                    notify({message:'<span style="color:#85ff85">RTN online</span>'});
                            }

                            RTN.send({client:{id:(CURRENT_USER?CURRENT_USER.id:0), cookie: getCookieParam('WS_WRITER_SESSION')}});
                            RTN._send();
                            window.setInterval(function(){ RTN._send(); },500);
                            if(params.reconnect && RTN.listeners){
                                    RTN.send({reconnect:true});
                                    for(i in RTN.listeners){
                                            RTN.addListener({event:i,handler:RTN.listeners[i]});
                                    }
                            }
                    };
                    RTN.WS.onmessage = function(msg) {
                            var data = JSON.parse(msg.data);
                            if(RTN.listeners[data.event]) {
                                RTN.listeners[data.event](data.data,data.event);
                                 console.log('RTN listeners', true);
                            }
  
                            console.log('RTN onmessage', true);

                    };
                    RTN.WS.onclose   = function(msg) {
                            if(CURRENT_USER.id == 73716 ){
                                    notify({message:'<span style="color:#ff7b7b">RTN offline</span>'});
                            }
                            window.setTimeout(function(){
                                    RTN.init({reconnect:true});
                            },2000);
                    };
                    
                      RTN.WS.onerror = function(error) {
                            //alert("Ошибка " + error.message);
                    };
            }
            catch(ex){
                    console.error(ex);
            }
    };
    RTN.queryQueue = new Array();

    RTN._send = function(){
            if(RTN.queryQueue.length == 0){
                    return false;
            }
            var data = RTN.queryQueue.pop();
            if(data && data != 'undefined'){
                    RTN.WS.send( JSON.stringify(data) );
            }

    };

    RTN.send = function(data){
            if(typeof data.action == 'undefined'){
                    data.action = 'say';
            }
            RTN.queryQueue.push(data);
    }

    RTN.addListener = function(settings){
            add = function(){
                    if(typeof settings.event !== 'object'){
                            settings.event = [settings.event];
                    }

                    RTN.send( {event:settings.event,action:'listen'} );

                    if(settings.handler){
                            for(i in settings.event)
                                    RTN.listeners[settings.event[i]] = settings.handler;
                    }
            }
            if(CURRENT_USER.id != 289594122){
            if(!RTN.WS){
                console.log('RTN INIT ON ADDLISTENER');
                    RTN.init({});
            }
            }
            add();
    };
    
    RTN.removeListener = function(eventName){
        remove = function(){
            if(RTN.listeners[eventName]) {
                    delete RTN.listeners[eventName]; 
            }  
        }
        remove();
    };
    
}});

$(document).ready(function () {
        
    RTN.addListener({
        event: ['writer_' + CURRENT_USER.id + '_sidebar'],
        handler: function (data, event) {
            changeSidebarData();
        }
    });
    
    RTN.addListener({
        event: ['writer_' + CURRENT_USER.id + '_forceassign'],
        handler: function (data, event) {
            forceAssignOrderRTNHandler(data, event);
        }
    });
    
});

    function initRtnOnOrder() {
        if (document.URL.includes('my_orders?subcom=detailed')) {
            RTN.addListener({
                event: ['writer_' + CURRENT_USER.id + '_' + ORDER.id, 'writer_onorder_' + CURRENT_USER.id + '_' + ORDER.id],
                handler: function (data, event) {
                    if (data.type && data.type == 'messageMarkReaded') {
                        changeMessageStatusToReaded(data.message_id);
                    } else if (data.type == 'statusOnlineChanged') {
                        changeClientStatusOnline(data);
                    } else if ((data.type == 'newMessage' || data.type == 'newFile') && typeof data.order != 'undefined') {
                        addNewMessage(data);
                    } else {
                        $.ionSound.play("button_tiny");
                        notify({
                            text: data.message,
                            type: data.type
                        });
                    }
                }
            })
        }
}
    
    function initRtnOnTicket() {
                if(document.URL.includes('tickets?subcom=detailed')) {
                    RTN.addListener({
                        event: [ 'writer_' + CURRENT_USER.id + '_ticket_' +  TICKET.id,],
                        handler: function (data, event) {
                                if(data.type && data.type == 'writerTicketNewMessage') {
                                     addNewMessageToTicket(data, true);
                                }
                        }
                    });  
            }    
    }
    
    function initRtnForCustomPages(){
        var add_events = '';
        if (CURRENT_USER.payment_rate != "UK"){
            var add_events = 'writer_not_uk';
        }

        setTimeout(function() {
            RTN.removeListener('writer_' + CURRENT_USER.id);
            RTN.removeListener('writer_all' + add_events);
            RTN.addListener({
                event: ['writer_' + CURRENT_USER.id ,'writer_all',  add_events],
                handler: function (data, event) {
                    if(data.type && data.type == 'verificationReminder'){
                        if(!last_verification_reminder || !$('#'+last_verification_reminder).length){
                            $.ionSound.play("button_tiny");
                            last_verification_reminder = notify({
                                text:'Please verify your contact and payment information',
                                type:null,
                                link:'/verification'
                            });
                        }
                    }else if(data.type && data.type == 'newMessage'){
                        // $.ionSound.play("button_tiny");

                        if( data.message.match(/Dear /) ){
                            //console.log('Dear found!');
                        }
                        if(!document.URL.includes('/my_orders?subcom=detailed&id='+data.order) && !document.URL.includes('/available_orders?subcom=detailed&id='+data.order) && !document.URL.includes('/orders_available?subcom=detailed&id='+data.order)){
                            notify({
                                text:data.message,
                                type:data.type,
                                //link:'/orders?subcom=detailed&id='+data.order
                                });
                        }
                    }else{
                        if(!document.URL.includes('/my_orders?subcom=detailed&id='+data.order) && !document.URL.includes('/available_orders?subcom=detailed&id='+data.order) && !document.URL.includes('/orders_available?subcom=detailed&id='+data.order)){
                        //     $.ionSound.play("button_tiny");
                                notify({
                                    text:data.message,
                                    type:data.type,
                                    //link:'/my_orders?subcom=detailed&id='+data.order
                                    });
                        }

                    }
                }
            });
            
            initRtnOnOrder();
            initRtnOnTicket();
            
            
        }, 200);
    }

if(typeof CURRENT_USER == 'object') {
    const SETTINGS_RTN = {
        host: 'socket.wenthost.org',
        port: '8080'
    };

    $(document).ready(function() {  
        if(CURRENT_USER.id == 289594122){
            console.log(1231231);
            console.log(getCookieParam('s_c'));
            const conn = new ab.Session(
                "wss://"+SETTINGS_RTN.host+":"+SETTINGS_RTN.port,
                function() {
                    conn.subscribe(getCookieParam('s_c'), function(conn_id, data) {
                        console.log(data);               
                    });
                },
                function() {
                    console.warn('WebSocket connection closed');
                },
                {'skipSubprotocolCheck': true}
            );
        }
    });
}
// Ion.Sound
// version 1.3.0 Build: 20
// © 2013 Denis Ineshin | IonDen.com
//
// Project page:    http://ionden.com/a/plugins/ion.sound/en.html
// GitHub page:     https://github.com/IonDen/ion.sound
//
// Released under MIT licence:
// http://ionden.com/a/plugins/licence-en.html
// =====================================================================================================================

(function ($) {

	if ($.ionSound) {
		return;
	}


	var settings = {},
		soundsNum,
		canMp3,
		url,
		i,

		sounds = {},
		playing = false,

		VERSION = "1.3.0";


	var createSound = function (soundInfo) {
		var name,
			volume;

		if (soundInfo.indexOf(":") !== -1) {
			name = soundInfo.split(":")[0];
			volume = soundInfo.split(":")[1];
		} else {
			name = soundInfo;
		}

		sounds[name] = new Audio();
		canMp3 = sounds[name].canPlayType("audio/mp3");
		if (canMp3 === "probably" || canMp3 === "maybe") {
			url = settings.path + name + ".mp3";
		} else {
			url = settings.path + name + ".ogg";
		}

		$(sounds[name]).prop("src", url);
		sounds[name].load();
		sounds[name].preload = "auto";
		sounds[name].volume = volume || settings.volume;
	};


	var playSound = function (info) {
		var $sound,
			name,
			volume,
			playing_int;

		if (info.indexOf(":") !== -1) {
			name = info.split(":")[0];
			volume = info.split(":")[1];
		} else {
			name = info;
		}

		$sound = sounds[name];

		if (typeof $sound !== "object" || $sound === null) {
			return;
		}


		if (volume) {
			$sound.volume = volume;
		}

		if (!settings.multiPlay && !playing) {

			$sound.play();
			playing = true;

			playing_int = setInterval(function () {
				if ($sound.ended) {
					clearInterval(playing_int);
					playing = false;
				}
			}, 250);

		} else if (settings.multiPlay) {

			if ($sound.ended) {
				$sound.play();
			} else {
				try {
					$sound.currentTime = 0;
				} catch (e) {}
				$sound.play();
			}

		}
	};


	var stopSound = function (name) {
		var $sound = sounds[name];

		if (typeof $sound !== "object" || $sound === null) {
			return;
		}

		$sound.pause();
		try {
			$sound.currentTime = 0;
		} catch (e) {}
	};


	var killSound = function (name) {
		var $sound = sounds[name];

		if (typeof $sound !== "object" || $sound === null) {
			return;
		}

		try {
			sounds[name].src = "";
		} catch (e) {}
		sounds[name] = null;
	};


	// Plugin methods
	$.ionSound = function (options) {

		settings = $.extend({
			sounds: [
				"water_droplet"
			],
			path: "static/sounds/",
			multiPlay: true,
			volume: "0.5"
		}, options);

		soundsNum = settings.sounds.length;

		if (typeof Audio === "function" || typeof Audio === "object") {
			for (i = 0; i < soundsNum; i += 1) {
				createSound(settings.sounds[i]);
			}
		}

		$.ionSound.play = function (name) {
			playSound(name);
		};
		$.ionSound.stop = function (name) {
			stopSound(name);
		};
		$.ionSound.kill = function (name) {
			killSound(name);
		};
	};


	$.ionSound.destroy = function () {
		for (i = 0; i < soundsNum; i += 1) {
			sounds[settings.sounds[i]] = null;
		}
		soundsNum = 0;
		$.ionSound.play = function () {};
		$.ionSound.stop = function () {};
		$.ionSound.kill = function () {};
	};

}(jQuery));



$.ionSound({
	sounds: [                       // set needed sounds names
		"button_tiny"
	],
	path: "public/sound/",                // set path to sounds
	multiPlay: false,               // playing only 1 sound at once
	volume: "1"                   // not so loud please
});
var gSeconds;
var ignore_validation = false;
var words;
var uploading_now = false;
var end =  false;

$(document).ready(function () {
    
   $("#ModalAdditional textarea").on("keyup", function () {
       if($(this).hasClass("only_txt")){
           words = countWords($(this));
           if(words > 0 && words <= 50){
               $("#ModalAdditional .submit_btn").removeClass("submit_btn-disabled");
           }else{
               $("#ModalAdditional .submit_btn").addClass("submit_btn-disabled");
               if(words > 50){
                   $("#ModalAdditional .error-50-words").show();
               }
           }
       }
       
       
    var description = $(this).val();
    var words = $.trim(description).split(" ");
    words = words.length;

    if (description.length > 0) {
        var regex = /^[a-z0-9 ~`!@#£€$¢¥§%°^&*()\-_+={}\[\]\|\\\/:;“’'"<>,\.\?]+$/ig;
        var result = description.match(regex);
        if (result == null) {
            $("#ModalAdditional .error-english").show();
            return false;
        } else {
            $("#ModalAdditional .error-english").hide();
        }
    }

   });
   
$(document).on('click', '#ModalAdditional .ok-btn', function () {
    location.reload();
});
/*
$('#ModalAdditional').on('hidden.bs.modal', function () {
    location.replace("/test");
});
   */ 
// ----------------------------------------------------------------------------------------------------------
    $(document).on('ready', '._timer-quiz', function () {

        if ($('._timer-quiz').length > 0) {
            timerStart($('._timer-quiz'), function () {
                var id = getUrlParameter("id");
                $("button.check").attr('data-ajax-load-page', "/test?subcom=quiz&id=" + id + "&time=1").trigger("click");
            });
        }
    });
// ----------------------------------------------------------------------------------------------------------

    if ($('._timer-quiz').length > 0) {
        timerStart($('._timer-quiz'), function () {
            var id = getUrlParameter("id");
            $("button.check").attr('data-ajax-load-page', "/test?subcom=quiz&id=" + id + "&time=1").trigger("click");
        });
    }

// ----------------------------------------------------------------------------------------------------------

    if ($('._text-timer').length > 0) {
        timerStart($('._text-timer'), function () {
            ignore_validation = true;
            $('.text-submit').removeClass("btn-disabled").trigger('click');

        });
    }

    $('#StepReceived').on('hidden.bs.modal', function () {
        location.replace("/test");
    })

    $('.test_modal').on('hidden.bs.modal', function () {
        location.replace("/test");
    })

    $('.test_modal').on('.submit_btn', function () {
        location.replace("/test");
    })

    $("textarea#writing-prompt").keyup(function () {
        words = countWords($(this));
    });

    if ($("textarea#writing-prompt").val() == "") {
        var id = getUrlParameter("id");

        $("textarea#writing-prompt").val($.cookie('text_' + id));
        countWords($("textarea#writing-prompt"));
    }

    $(".text-submit").click(function () {
        var form = $("form#test-writing-prompt");
        words = countWords($("textarea#writing-prompt"));
        if (!ignore_validation) {
            if (words < 100) {
                $(".min-100-words").show();
                return false;
            } else if (words > 150) {
                $(".max-150-words").show();
                return false;
            }
        }

        subject = $("input[name='subject']:checked").val()
        id = $("input[name='id']").val()
        text = $("textarea#writing-prompt").val();

        callAjax('json', '/test?ajax=TextDoneNew', function (data) {
            if (data.test) {
                $("#StepReceived").modal('show');
            }
        }, {
            id: id,
            subject: subject,
            text: Base64.encode(text)
        });
        return false;
    });
// ----------------------------------------------------------------------------------------------------------
    $(".update-panel").click(function () {
        var button = $(".update-panel").addClass("btn-disabled");
        button.find('i').removeClass('fa-upload').addClass('fa-spinner').addClass('fa-spin');
        callAjax('json', '/test?ajax=UpdatePanel', function (data) {
            $(".update-panel").removeClass("btn-disabled");
            button.find('i').addClass('fa-upload').removeClass('fa-spinner').removeClass('fa-spin');
            location.reload();
        }, {});
    });
// ------------ S L I D E R     S T A R T -------------------------------------------------------------------
    $(document).on('click', ".slider-btn", function () {

        var slides_count = $(".tutorial-block .tutorial-slide").length;
        var index = $(".tutorial-slide.active").index() + 1;
        if ($(this).data("step") == "+" && index < slides_count) {
            $(".tutorial-slide.active").removeClass("active").next(".tutorial-slide").addClass("active");
        } else if ($(this).data("step") == "-" && index > 1) {
            $(".tutorial-slide.active").removeClass("active").prev(".tutorial-slide").addClass("active");
        }

        index = $(".tutorial-slide.active").index() + 1;
        $(".current-item").text(index);
        if (index > 1) {
            $("#back").removeClass("disabled");
        } else {
            $("#back").addClass("disabled");
        }

        if (index > slides_count - 1) {
            $("#next").text("Finish");
            var id = getUrlParameter("id");
            var tutorial = getUrlParameter("tutorial");
            var active_step = $(".test-inner").data("active-step");
            if (tutorial && tutorial < active_step) {
                tutorial++;
                setTimeout(() => $("#next").attr('data-ajax-load-page', "/test?subcom=quiz&id=" + id + "&tutorial=" + tutorial), 100);
            } else {
                setTimeout(() => $("#next").attr('data-ajax-load-page', "/test?subcom=quiz&id=" + id + "&start=1"), 100);
            }

        } else {
            $("#next").text("Next");
            $("#next").removeAttr("data-ajax-load-page");
        }

    });
// ----------------------------------------------------------------------------------------------------------
    $(document).on('click', ".checkbox-tooltip .close", function () {
        $(this).parents(".checkbox-tooltip").hide();
    });
// ----------------------------------------------------------------------------------------------------------

    $(document).on('change', ".quiz-form input[name='variant']", function () {
        $(this).parents(".quiz-form").find("button.check").removeClass("submit_btn-disabled");
    });

    $(document).on('change', ".quiz-form input[name='variant']", function () {
        $(this).parents(".quiz-form").find("button.check").removeClass("submit_btn-disabled");
        $(this).parents(".quiz-content").find("button.check_mobile").removeClass("submit_btn-disabled");
    });

    $(document).on('click', "button.check_mobile", function () {
        console.log("mobile.check");
        $(".quiz-form:not(.d-none)").find("button.check").trigger("click");
    });
    // ----------------------------------------------------------------------------------------------------------
    $(document).on('submit', ".quiz-form", function () {
        var form = $(this);
        if ($(form).find("button.check").html() == "Next") {
            form.next().removeClass("d-none");
            form.remove();
            $(".quiz-content").find("button.check_mobile span").text("Check");
            $(".quiz-content").find("button.check_mobile").addClass("submit_btn-disabled");
            return false;
        }
        if ($(form).find("button.check").hasClass("submit_btn-disabled")) {
            return false;
        }
        callAjax('json', '/test?ajax=CheckQuiz', function (data) {
            $(".checkbox-tooltip").hide()
            if (data.result.rignt_answer == 1) {
                $(form).find("input[name='variant']:checked").parent(".radio-box").addClass("correct-answer");
                $(form).find("input[name='variant']:checked").parent(".radio-box").find(".checkbox-tooltip").show().removeClass("wrong").addClass("correctly")
                $(form).find("button.check").html("Next");
            } else if (data.result.rignt_answer == 2) {
                $(form).find("input[name='variant']:checked").parent(".radio-box").addClass("correct-answer");
                $(form).find("input[name='variant']:checked").parent(".radio-box").find(".checkbox-tooltip").show().removeClass("wrong").addClass("correctly")
                $(form).find("button.check").html("Next");
                var id = getUrlParameter("id");
                $(form).find("button.check").attr('data-ajax-load-page', "/test?subcom=quiz&id=" + id + "&end=1");
                end = true;
            } else if (data.result.rignt_answer == 0) {
                $(form).find("input[name='variant']:checked").parent(".radio-box").addClass("wrong-answer");
                $(form).find("input[name='variant']:checked").parent(".radio-box").find(".checkbox-tooltip").show();
                $(".attempts-item:not(.attempts-wrong)").first().addClass("attempts-wrong");
                $(form).find("button.check").addClass("submit_btn-disabled").find("span").html("Select correct answer");
                var attempts_count = $(".attempts-wrong").length;
                var attempts = $(".attempts-block").data("attempts");
                if (attempts_count >= attempts) {
                    $("button.check").attr('data-ajax-load-page', "/test?subcom=quiz&id&fail=1").trigger("click");
                }
            }
            $(".quiz-content").find("button.check_mobile span").text($(form).find("button.check").text());
        }, form.serialize());
        return false;
    });
    // ----------------------------------------------------------------------------------------------------------
    $(document).on('click', "#KnowledgeTestLeaving .tikai-z-sela", function () {
        obj = $(this)
        var id = getUrlParameter("id");
        callAjax('json', '/test?ajax=ResetQuiz', function (data) {
            location.replace(obj.attr("href"));
        }, {
            id: id
        });
        return false;

    });

    // ----------------------------------------------------------------------------------------------------------
});
function countWords(obj) {
    if (obj.val() == "") {
        $("#words").text(0);
        $(".test-error ").hide();
        $(".text-submit").addClass("btn-disabled");
        return 0;
    }
    var text = obj.val();


    var regex = /^[a-zA-Z0-9$@$!%*?&#^-_.\-\"\'\:=,\(\)\-s;`\n +]+$/g;
    var result = text.match(regex);

    if (result == null) {
        $(".english-only").show();
    } else {
        $(".english-only").hide();
    }

    var id = getUrlParameter("id");

    $.cookie('text_' + id, obj.val());
    var words = $.trim(obj.val()).replace(/\s+/g, ' ').trim().split(" ");
    var lines = $.trim(obj.val()).replace(/\s+/g, ' ').trim().split("\n\
");

    count = words.length + (lines.length - 1);
    $("#words").text(count);
    if (count > 150) {
        $(".max-150-words").show();
        $("#words").addClass("step-words__value")
        $(".icon-filled").addClass("d-none")
    } else {
        $(".max-150-words").hide();
        if (count >= 100) {
            $(".icon-filled").removeClass("d-none")
        } else {
            $(".icon-filled").addClass("d-none")
        }
        $("#words").removeClass("step-words__value")
    }

    if (count >= 100) {
        $(".text-submit").removeClass("btn-disabled");
    } else {
        $(".text-submit").addClass("btn-disabled");
    }

    return count;
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
}
;
function timerStart(el, callback) {

    var text_timer = window.setInterval(function () {
        var minutesEl = el.find('.minutes');
        var secondsEl = el.find('.seconds');
        var minutes = minutesEl.html();
        var seconds = secondsEl.html();
        gSeconds = seconds * 1 + minutes * 60;

        gSeconds--;
        if (gSeconds < 0) {
            callback();
            clearInterval(text_timer);
            return false;
        }

        var cMinutes = Math.floor(gSeconds / 60);
        var cSeconds = gSeconds % 60;
        if (gSeconds < 30) {
            minutesEl.css('color', 'red');
            secondsEl.css('color', 'red');
        }

        minutesEl.html(cMinutes < 10 ? '0' + cMinutes : cMinutes);
        secondsEl.html(cSeconds < 10 ? '0' + cSeconds : cSeconds);
    }, 1000);
}

function buttonDisable(button_el) {
    if (!button_el.hasClass('disabled')) {
        button_el.addClass('disabled');
        button_el.attr('disabled', 'disabled').css('pointer-events', 'none');
        button_el.find('i.fa').addClass('fa-spin').addClass('fa-spinner');
        return true;
    } else {
        return false;
    }
}

// ----------------------------------------------------------------------------------------------------------
function initTest() {
// ----------------------------------------------------------------------------------------------------------
    var subcom = getUrlParameter("subcom");

    if (subcom == "text") {

        $(".dropdown-item").each(function () {
            $(this).removeAttr("data-ajax-load-page");
        })

        $(document).on('click', "a", function (event) {
            var href = $(this).attr("href")
            var container = $(".step-wrapper");
            if (
                    !$(this).hasClass("tikai-z-sela")
                    && !$(this).hasClass("update-panel")
                    && typeof href !== undefined && href.length > 0
                    // if the target of the click isn't the container nor a descendant of the container
                    && !container.is(event.target) && container.has(event.target).length === 0)
            {
                //obj.preventDefault();
                console.log("show");
                $("#LeaveTest").modal('show')//.find(".tikai-z-sela").attr(href);
                $("#LeaveTest").find(".tikai-z-sela").attr("href", href);
                return false;
            } else {
                return true;
                console.log("not show");
            }
        });
    }

    if (subcom == "quiz") {

        $(".dropdown-item").each(function () {
            $(this).removeAttr("data-ajax-load-page");
        })

        $(document).on('click', "a", function (event) {
            var href = $(this).attr("href")
            var container = $(".step-wrapper");
            if (
                    !$(this).hasClass("tikai-z-sela")
                    && !$(this).hasClass("update-panel")
                    && typeof href !== undefined && href.length > 0
                    && !end
                    // if the target of the click isn't the container nor a descendant of the container
                    && !container.is(event.target) && container.has(event.target).length === 0)
            {
                $("#KnowledgeTestLeaving").modal('show');
                $("#KnowledgeTestLeaving").find(".tikai-z-sela").attr("href", href);
                return false;
            } else {
                return true;
            }
        });

        $(document).on('click', ".form-close", function (event) {
            //obj.preventDefault();
            console.log("show");
            $("#KnowledgeTestLeaving").modal('show')//.find(".tikai-z-sela").attr(href);
            $("#KnowledgeTestLeaving").find(".tikai-z-sela").attr("href", "/test");
            return false;
        });

        $(document).on('click', ".tutorial-close", function (event) {
            //obj.preventDefault();
            console.log("show");
            $("#KnowledgeTestLeaving").modal('show')//.find(".tikai-z-sela").attr(href);
            $("#KnowledgeTestLeaving").find(".tikai-z-sela").attr("href", "/test");
            return false;
        });
    }

// ----------------------------------------------------------------------------------------------------------

    /**
     Start Essay Modal
     */

    (function () {

        var dropArea = document.getElementById('dragndrop_esse_files_area');
        var _preventDefault = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        dropArea.addEventListener('dragenter', _preventDefault, false);
        dropArea.addEventListener('dragover', _preventDefault, false);
        dropArea.addEventListener('dragleave', _preventDefault, false);
        dropArea.addEventListener('drop', _preventDefault, false);
        dropArea.addEventListener('dragenter', function (e) {
            if (Object.keys(UploadEssay.uploaded_files_list).length < UploadEssay.limitFiles) {
                $(dropArea).addClass('drag-action');
            }
            return false;
        }, false);
        dropArea.addEventListener('dragleave', function (e) {
            $(dropArea).removeClass('drag-action');
            return false;
        }, false);
        dropArea.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            UploadEssay.dragDropFile(e);
            return false;
        }, false);
    }());
    (function () {

        var dropArea = document.getElementById('dragndrop_cv_files_area');
        var _preventDefault = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        dropArea.addEventListener('dragenter', _preventDefault, false);
        dropArea.addEventListener('dragover', _preventDefault, false);
        dropArea.addEventListener('dragleave', _preventDefault, false);
        dropArea.addEventListener('drop', _preventDefault, false);
        dropArea.addEventListener('dragenter', function (e) {
            if (Object.keys(UploadCV.uploaded_files_list).length < UploadCV.limitFiles) {
                $(dropArea).addClass('drag-action');
            }
            return false;
        }, false);
        dropArea.addEventListener('dragleave', function (e) {
            $(dropArea).removeClass('drag-action');
            return false;
        }, false);
        dropArea.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            UploadCV.dragDropFile(e);
            return false;
        }, false);
    }());

    (function () {

        var dropArea = document.getElementById('dragndrop_sample_files_area');
        var _preventDefault = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        dropArea.addEventListener('dragenter', _preventDefault, false);
        dropArea.addEventListener('dragover', _preventDefault, false);
        dropArea.addEventListener('dragleave', _preventDefault, false);
        dropArea.addEventListener('drop', _preventDefault, false);
        dropArea.addEventListener('dragenter', function (e) {
            if (Object.keys(UploadSample.uploaded_files_list).length < UploadSample.limitFiles) {
                $(dropArea).addClass('drag-action');
            }
            return false;
        }, false);
        dropArea.addEventListener('dragleave', function (e) {
            $(dropArea).removeClass('drag-action');
            return false;
        }, false);
        dropArea.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            UploadSample.dragDropFile(e);
            return false;
        }, false);
    }());

    (function () {
        var dropArea = document.getElementById('dragndrop_diploma_files_area');
        var _preventDefault = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        dropArea.addEventListener('dragenter', _preventDefault, false);
        dropArea.addEventListener('dragover', _preventDefault, false);
        dropArea.addEventListener('dragleave', _preventDefault, false);
        dropArea.addEventListener('drop', _preventDefault, false);
        dropArea.addEventListener('dragenter', function (e) {
            if (Object.keys(UploadDiploma.uploaded_files_list).length < UploadDiploma.limitFiles) {
                $(dropArea).addClass('drag-action');
            }
            return false;
        }, false);
        dropArea.addEventListener('dragleave', function (e) {
            $(dropArea).removeClass('drag-action');
            return false;
        }, false);
        dropArea.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            UploadDiploma.dragDropFile(e);
            return false;
        }, false);
    }());
}


$("#ModalEssay").on("show.bs.modal", function () {
    var count_upload_files = $('[data-target="#ModalEssay"]').attr('data-count-download-files');
    if (count_upload_files) {
        //UploadEssay.limitFiles = 3 - count_upload_files;
    }
});
//posible-count-upload-files
$(document).on('change', '#ModalEssay [data-form-essay] [name="file"]', function () {
    UploadEssay.preloadFiles($(this)[0].files);
});
$(document).on('click', '#ModalEssay [data-submit-modal]', function () {

    if (!UploadEssay.checkFiles()) {
        $("#ModalEssay .file-load-error").show();
        return false;
    }

    var description = $("#ModalEssay textarea[name='description']").val();
    var words = $.trim(description).split(" ");
    words = words.length;

    if (description.length > 0) {
        var regex = /^[a-zA-Z0-9$@$!%*?&#^-_.\-\"\'\s;` +]+$/g;
        var result = description.match(regex);
        if (result == null) {
            $("#ModalEssay .error-english").show();
            return false;
        } else {
            $("#ModalEssay .error-english").hide();
        }
    }

    if (words > 50) {
        $("#ModalEssay .error-50-words").show();
        return false;
    } else {
        $("#ModalEssay .error-50-words").hide();
    }

    UploadEssay.uploadFiles($(this).closest('form'));
});
var UploadEssay = {
    limitFiles: 1,
    uploaded_files_list: {},
    files_left_to_upload: null,
    dragDropFile: function (e) {
        if (Object.keys(UploadEssay.uploaded_files_list).length < UploadEssay.limitFiles) {
            UploadEssay.preloadFiles(e.dataTransfer.files);
        }
        return false;
    },
    updateFileUploadProcess: function (file_tmp_name) {
        var is_online = window.navigator.onLine;
        if (!is_online) {
            var file_block = $("#ModalEssay .fileload-container .fileload-item[data-file-temp-name='" + file_tmp_name + "']");
            file_block.find('.file_load_progress').hide();
            file_block.find('.file_load_size').hide();
            file_block.addClass('fileload-item-error');
            var error_text = 'Upload failure (no connection).';
            file_block.find('.attachment-error').html(error_text).removeAttr('style');
            return false;
        } else {
            var file_block = $("#ModalEssay .fileload-container .fileload-item[data-file-temp-name='" + file_tmp_name + "']");
            file_block.removeClass('fileload-item-error');
            var error_text = 'Upload failure (no connection).';
            file_block.find('.attachment-error').html("").removeAttr('style');
        }
        var file_block = $("#ModalEssay .fileload-item[data-file-temp-name='" + file_tmp_name + "']");
        var current_status = parseInt(file_block.find('.file_load_progress').attr('aria-valuenow'));
        // calculate what part of file can be uploaded in 1/20 of second
        var step_for_progress = 1 / (UploadEssay.uploaded_files_list[file_tmp_name].size / (internet_speed.value.bytes / 20 /* speed for 1/20 sec */));
        if (step_for_progress > 1) {
            file_block.find('.file_load_progress').attr('aria-valuenow', '100')
                    .find('.progress-bar').css('width', '100%');
        } else {
            var new_status = current_status + (step_for_progress * 100);
            new_status = new_status > 100 ? 100 : new_status;
            file_block.find('.file_load_progress').attr('aria-valuenow', new_status)
                    .find('.progress-bar').css('width', new_status + '%');
        }
    },
    uploadFiles: function (form) {
        if (!uploading_now) {
            uploading_now = true;
            form.find('[data-submit-modal]').find('.sk-fading-circle').show();
            UploadEssay.files_left_to_upload = Object.keys(UploadEssay.uploaded_files_list).length;
            $.each(UploadEssay.uploaded_files_list, function (file_tmp_name, file_data) {
                var form_data = new FormData();
                form_data.append('file_tmp_name', file_tmp_name);
                form_data.append('file', file_data);
                form_data.append('test_id', $("#test-all").data("test-id"));
                form_data.append('description', $("#ModalEssay textarea[name='description']").val());
                var file_block = $("#ModalEssay .fileload-item[data-file-temp-name='" + file_tmp_name + "']");

                file_block.find('.file-load-cancel, .file_load_size').show();
                file_block.find('.file_load_progress').show();


                UploadEssay.uploaded_files_list[file_tmp_name].interval = setInterval(UploadEssay.updateFileUploadProcess(file_tmp_name), 50, file_tmp_name); // 1/20 part of secont

                $.ajax({
                    url: 'test?ajax=UploadEssay', // point to server-side PHP script
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: form_data,
                    method: 'POST',
                    type: 'POST',
                    success: function (data) {
                        clearInterval(UploadEssay.uploaded_files_list[file_tmp_name].interval);
                        UploadEssay.uploaded_files_list[file_tmp_name].interval = false;
                        file_block.find('.file_load_progress').fadeOut(100, function () {
                            file_block.find('.upload-done-icon, .file_load_size').fadeIn(100);
                        });
                        UploadEssay.files_left_to_upload--;
                        if (UploadEssay.files_left_to_upload === 0) {
                            form.find('[data-submit-modal]').find('.sk-fading-circle').hide();
                            setTimeout(function () {

                                uploading_now = false;
                                UploadEssay.clearModal();
                                setTimeout(function () {
                                    data = JSON.parse(data)
                                    if (data.result == 1) {
                                        $("#EssaySubmitted").modal('show');
                                    } else if (data.result == 2) {
                                        $("#TestCongratulations").modal('show');
                                    }   
                                    
                                }, 500);

                            }, 1000);
                        }
                    },
                    error: function (data) {
                        form.find('[data-submit-modal]').find('.sk-fading-circle').hide();
                    }
                });
            }
            );
        }
    },
    clearModal: function () {
        UploadEssay.uploaded_files_list = {};
        var modal = $("#ModalEssay");
        modal.modal('hide');
        modal.find(".modal-body > .attachment-error.error-type").hide();
        modal.find(".drop-files--extended__container").removeClass('disabled-upload');
        modal.find(".modal-body .attachment-error.error-count").hide();
        modal.find(".error-files").empty();
        modal.find(".valid-files").empty();
        modal.find("[data-submit-modal]").addClass('submit_btn-disabled');
    },
    checkFiles: function () {
        var check = true;
        if (Object.keys(UploadEssay.uploaded_files_list).length == 0) {
            check = false;
        }
        console.log("checkFiles");

        //validate files
        var error_uploaded_files = $("#ModalEssay .fileload-container .error-files .fileload-item");
        $("#ModalEssay .drop-files--extended__container").removeClass("error");
        if (error_uploaded_files.length > 0) {
            //$("#ModalEssay .modal-body > .attachment-error.error-type").show();
            check = false;
        } else {
            //$("#ModalEssay .modal-body > .attachment-error.error-type").hide();
        }

        //validate posibility to upload files
        if (Object.keys(UploadEssay.uploaded_files_list).length >= UploadEssay.limitFiles) {
            $("#ModalEssay .drop-files--extended__container").addClass('disabled-upload');
        } else {
            $("#ModalEssay .drop-files--extended__container").removeClass('disabled-upload');
        }

        //validate count files
        if (Object.keys(UploadEssay.uploaded_files_list).length > 0) {
            $("#ModalEssay #dragndrop_esse_files_area").hide();
            $("#ModalEssay .uploaded-file").show();
        } else {
            $("#ModalEssay #dragndrop_esse_files_area").show();
            $("#ModalEssay .uploaded-file").hide();
        }

        if (Object.keys(UploadEssay.uploaded_files_list).length > UploadEssay.limitFiles) {
            $("#ModalEssay .modal-body .attachment-error.error-count").show();
            check = false;
        } else {
            $("#ModalEssay .modal-body .attachment-error.error-count").hide();
        }

        //button submit
        if (check) {
            $("#ModalEssay [data-submit-modal]")
                    .removeClass('submit_btn-disabled');
            $("#ModalEssay .file-load-error").hide();
        } else {
            $("#ModalEssay [data-submit-modal]")
                    .addClass('submit_btn-disabled');
        }

        return check;
    },
    removeTmpMessageFile: function () {
        var button = $(this),
                file_block = button.parent().closest('.fileload-item');
        delete UploadEssay.uploaded_files_list[file_block.attr('data-file-temp-name')];
        file_block.slideUp(200, function () {
            $(this).detach();
            UploadEssay.checkFiles();
        });
    },
    preloadFiles: function (pre_files) {
        if (!pre_files.length) {
            return false;
        }
        var parsed_html_data = {
            error_block: "",
            valid_block: ""
        };
        $.each(
                pre_files,
                function (iter, file_data) {

                    var file_name = file_data.name,
                            file_name_transl = rus_to_latin(file_name),
                            tmp_file_name = Date.now() + '---' + Base64.encode(file_name_transl);
                    var valid_ext = checkFileExtension(file_name, ["doc", "docx"]);
                    file_data.name = file_name_transl;
                    file_data.interval = false;
                    if (MAX_FILESIZE > file_data.size && valid_ext) {
                        UploadEssay.uploaded_files_list[tmp_file_name] = file_data;
                    }

                    var validation_errors = {
                        file_size_error: MAX_FILESIZE < file_data.size ? 'File size exceeds 50 Mb' : false,
                        extension_error: valid_ext ? false : 'Wrong file format. Use doc, docx format.'
                    };
                    var file_size_data = parseBytes(file_data.size);
                    var jSmartyObject = new jSmart($("#essay_file_item")[0].innerHTML);
                    var current_html = jSmartyObject.fetch({
                        in_development: in_development,
                        file_data_tmp_name: tmp_file_name,
                        remove_function_name: 'UploadEssay.removeTmpMessageFile.call(this)',
                        file_data: {
                            name: file_name_transl,
                            cropped_name: croppString(file_name_transl, 25, 7),
                            size: file_size_data.size + " " + file_size_data.size_type
                        },
                        validation_error: validation_errors.file_size_error ?
                                validation_errors.file_size_error
                                : (
                                        validation_errors.extension_error ?
                                        validation_errors.extension_error
                                        : false
                                        )
                    });
                    if (MAX_FILESIZE < file_data.size || !valid_ext) {
                        parsed_html_data.error_block += current_html;
                    } else {
                        parsed_html_data.valid_block += current_html;
                    }
                }
        );
        $("#ModalEssay .fileload-container .error-files").append(parsed_html_data.error_block);
        $("#ModalEssay .fileload-container .valid-files").append(parsed_html_data.valid_block);
        UploadEssay.checkFiles();
        $("#ModalEssay #files_input").val('');
    }


};
/**
 END Essay Modal
 */
// ----------------------------------------------------------------------------------------------------------
/**
 Start Sample Modal
 */

$("#ModalSample").on("show.bs.modal", function () {
    var count_upload_files = $('[data-target="#ModalSample"]').attr('data-count-download-files');
    if (count_upload_files) {
        UploadSample.limitFiles = 3 - count_upload_files;
    }
});
//posible-count-upload-files
$(document).on('change', '#ModalSample [data-form-sample] [name="files[]"]', function () {
    UploadSample.preloadFiles($(this)[0].files);
});
$(document).on('click', '#ModalSample [data-submit-modal]', function () {
    if (!UploadSample.checkFiles()) {
        $("#ModalSample .file-load-error").show();
        return false;
    }



    var description = $("#ModalSample textarea[name='description']").val();
    var words = $.trim(description).split(" ");
    words = words.length;

    if (description.length > 0) {
        var regex = /^[a-zA-Z0-9$@$!%*?&#^-_.\-\"\'\s;` +]+$/g;
        var result = description.match(regex);
        if (result == null) {
            $("#ModalSample .error-english").show();
            return false;
        } else {
            $("#ModalSample .error-english").hide();
        }
    }

    if (words > 50) {
        $("#ModalSample .error-50-words").show();
        return false;
    } else {
        $("#ModalSample .error-50-words").hide();
    }

    UploadSample.uploadFiles($(this).closest('form'));
});
var UploadSample = {
    limitFiles: 3,
    uploaded_files_list: {},
    files_left_to_upload: null,
    dragDropFile: function (e) {
        if (Object.keys(UploadSample.uploaded_files_list).length < UploadSample.limitFiles) {
            UploadSample.preloadFiles(e.dataTransfer.files);
        }
        return false;
    },
    updateFileUploadProcess: function (file_tmp_name) {
        var is_online = window.navigator.onLine;
        if (!is_online) {
            var file_block = $("#ModalSample .fileload-container .fileload-item[data-file-temp-name='" + file_tmp_name + "']");
            file_block.find('.file_load_progress').hide();
            file_block.find('.file_load_size').hide();
            file_block.addClass('fileload-item-error');
            var error_text = 'Upload failure (no connection).';
            file_block.find('.attachment-error').html(error_text).removeAttr('style');
            return false;
        } else {
            var file_block = $("#ModalSample .fileload-container .fileload-item[data-file-temp-name='" + file_tmp_name + "']");
            file_block.removeClass('fileload-item-error');
            var error_text = 'Upload failure (no connection).';
            file_block.find('.attachment-error').html("").removeAttr('style');
        }

        var file_block = $("#ModalSample .fileload-item[data-file-temp-name='" + file_tmp_name + "']");
        var current_status = parseInt(file_block.find('.file_load_progress').attr('aria-valuenow'));
        // calculate what part of file can be uploaded in 1/20 of second
        var step_for_progress = 1 / (UploadSample.uploaded_files_list[file_tmp_name].size / (internet_speed.value.bytes / 20 /* speed for 1/20 sec */));
        if (step_for_progress > 1) {
            file_block.find('.file_load_progress').attr('aria-valuenow', '100')
                    .find('.progress-bar').css('width', '100%');
        } else {
            var new_status = current_status + (step_for_progress * 100);
            new_status = new_status > 100 ? 100 : new_status;
            file_block.find('.file_load_progress').attr('aria-valuenow', new_status)
                    .find('.progress-bar').css('width', new_status + '%');
        }
    },
    uploadFiles: function (form) {
        if (!uploading_now) {
            uploading_now = true;
            form.find('[data-submit-modal]').find('.sk-fading-circle').show();
            UploadSample.files_left_to_upload = Object.keys(UploadSample.uploaded_files_list).length;
            $.each(UploadSample.uploaded_files_list, function (file_tmp_name, file_data) {
                var form_data = new FormData();
                form_data.append('file_tmp_name', file_tmp_name);
                form_data.append('files[]', file_data);
                form_data.append('description', $("#ModalSample textarea[name='description']").val());
                var file_block = $("#ModalSample .fileload-item[data-file-temp-name='" + file_tmp_name + "']");

                file_block.find('.file-load-cancel, .file_load_size').show();
                file_block.find('.file_load_progress').show();

                UploadSample.uploaded_files_list[file_tmp_name].interval = setInterval(UploadSample.updateFileUploadProcess(file_tmp_name), 50, file_tmp_name); // 1/20 part of secont

                $.ajax({
                    url: 'test?ajax=UploadSample', // point to server-side PHP script
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: form_data,
                    method: 'POST',
                    type: 'POST',
                    success: function (data) {
                        console.log("success")
                        if (Object.keys(UploadSample.uploaded_files_list).length == 1) {
                            $("#SamplesSubmitted span.samples").text("sample is")
                        }

                        clearInterval(UploadSample.uploaded_files_list[file_tmp_name].interval);
                        UploadSample.uploaded_files_list[file_tmp_name].interval = false;

                        file_block.find('.file_load_progress').fadeOut(100, function () {
                            file_block.find('.upload-done-icon, .file_load_size').fadeIn(100);
                        });

                        UploadSample.files_left_to_upload--;
                        if (UploadSample.files_left_to_upload === 0) {
                            form.find('[data-submit-modal]').find('.sk-fading-circle').hide();
                            setTimeout(function () {
                                uploading_now = false;
                                UploadSample.clearModal();
                                setTimeout(function () {
                                    $("#SamplesSubmitted").modal('show');

                                }, 500);

                            }, 1000);
                        }
                    },
                    error: function (data) {
                        form.find('[data-submit-modal]').find('.sk-fading-circle').hide();

                    }
                });
            }
            );
        }
    },
    clearModal: function () {
        UploadSample.uploaded_files_list = {};
        var modal = $("#ModalSample");
        modal.modal('hide');
        modal.find(".modal-body > .attachment-error.error-type").hide();
        modal.find(".drop-files--extended__container").removeClass('disabled-upload');
        modal.find(".modal-body .attachment-error.error-count").hide();
        modal.find(".error-files").empty();
        modal.find(".valid-files").empty();
        modal.find("[data-submit-modal]").addClass('submit_btn-disabled');
    },
    checkFiles: function () {
        var check = true;
        if (Object.keys(UploadSample.uploaded_files_list).length == 0) {
            check = false;
        }

        //validate files
        var error_uploaded_files = $("#ModalSample .fileload-container .error-files .fileload-item");
        $("#ModalSample .drop-files--extended__container").removeClass("error");
        if (error_uploaded_files.length > 0) {
            //$("#ModalSample .modal-body > .attachment-error.error-type").show();
            check = false;
        } else {
            //$("#ModalSample .modal-body > .attachment-error.error-type").hide();
        }

        //validate posibility to upload files
        if (Object.keys(UploadSample.uploaded_files_list).length >= UploadSample.limitFiles) {
            $("#dragndrop_sample_files_area").addClass("non-active").tooltip("enable");
            $("#ModalSample .drop-files--extended__container").addClass('disabled-upload');
        } else {
            $("#dragndrop_sample_files_area").removeClass("non-active").tooltip("disable");
            $("#ModalSample .drop-files--extended__container").removeClass('disabled-upload');
        }

        //validate count files
        if (Object.keys(UploadSample.uploaded_files_list).length > UploadSample.limitFiles) {
            $("#ModalSample .modal-body .attachment-error.error-count").show();
            check = false;
        } else {
            $("#ModalSample .modal-body .attachment-error.error-count").hide();
        }

        //button submit
        if (check) {
            $("#ModalSample [data-submit-modal]")
                    .removeClass('submit_btn-disabled');
            $("#ModalSample .file-load-error").hide();
        } else {
            $("#ModalSample [data-submit-modal]")
                    .addClass('submit_btn-disabled');
        }

        return check;
    },
    removeTmpMessageFile: function () {
        var button = $(this),
                file_block = button.parent().closest('.fileload-item');
        delete UploadSample.uploaded_files_list[file_block.attr('data-file-temp-name')];
        file_block.slideUp(200, function () {
            $(this).detach();
            UploadSample.checkFiles();
        });
    },
    preloadFiles: function (pre_files) {
        if (!pre_files.length) {
            return false;
        }
        var parsed_html_data = {
            error_block: "",
            valid_block: ""
        };

        var files = 0;

        $.each(
                pre_files,
                function (iter, file_data) {

                    if (Object.keys(UploadSample.uploaded_files_list).length > UploadSample.limitFiles - 1) {
                        return;
                    }

                    var file_name = file_data.name,
                            file_name_transl = rus_to_latin(file_name),
                            tmp_file_name = Date.now() + '---' + Base64.encode(file_name_transl);
                    var valid_ext = checkFileExtension(file_name, ["doc", "docx", "pdf", ]);
                    file_data.name = file_name_transl;
                    file_data.interval = false;
                    if (MAX_FILESIZE > file_data.size && valid_ext) {
                        UploadSample.uploaded_files_list[tmp_file_name] = file_data;
                    }

                    var validation_errors = {
                        file_size_error: MAX_FILESIZE < file_data.size ? 'File size exceeds 50 Mb' : false,
                        extension_error: valid_ext ? false : 'Wrong file format. Use doc, docx, pdf format.'
                    };
                    var file_size_data = parseBytes(file_data.size);
                    var jSmartyObject = new jSmart($("#sample_file_item")[0].innerHTML);
                    var current_html = jSmartyObject.fetch({
                        in_development: in_development,
                        file_data_tmp_name: tmp_file_name,
                        remove_function_name: 'UploadSample.removeTmpMessageFile.call(this)',
                        file_data: {
                            name: file_name_transl,
                            cropped_name: croppString(file_name_transl, 25, 7),
                            size: file_size_data.size + " " + file_size_data.size_type
                        },
                        validation_error: validation_errors.file_size_error ?
                                validation_errors.file_size_error
                                : (
                                        validation_errors.extension_error ?
                                        validation_errors.extension_error
                                        : false
                                        )
                    });
                    if (MAX_FILESIZE < file_data.size || !valid_ext) {
                        parsed_html_data.error_block += current_html;
                    } else {
                        parsed_html_data.valid_block += current_html;
                    }
                }
        );
        $("#ModalSample .fileload-container .error-files").append(parsed_html_data.error_block);
        $("#ModalSample .fileload-container .valid-files").append(parsed_html_data.valid_block);
        UploadSample.checkFiles();
        $("#ModalSample #files_input").val('');
    }
};
/**
 END Sample Modal
 */

// ----------------------------------------------------------------------------------------------------------


/**
 Start Additional Modal
 */


if(!$("#ModalAdditional").hasClass("additional_txt")){
    
    $("#ModalAdditional").on("show.bs.modal", function () {
    var count_upload_files = $('[data-target="#ModalAdditional"]').attr('data-count-download-files');
    if (count_upload_files) {
        UploadAdditional.limitFiles = 3 - count_upload_files;
    }
});
//posible-count-upload-files
$(document).on('change', '#ModalAdditional [data-form-additional] [name="files[]"]', function () {
    UploadAdditional.preloadFiles($(this)[0].files);
});
$(document).on('click', '#ModalAdditional [data-submit-modal]', function () {
    if (!UploadAdditional.checkFiles()) {
        $("#ModalAdditional .file-load-error").show();
        return false;
    }



    var description = $("#ModalAdditional textarea[name='description']").val();
    var words = $.trim(description).split(" ");
    words = words.length;



    if (words > 50) {
        $("#ModalAdditional .error-50-words").show();
        return false;
    } else {
        $("#ModalAdditional .error-50-words").hide();
    }

    UploadAdditional.uploadFiles($("#ModalAdditional form"));
});
var UploadAdditional = {
    limitFiles: 3,
    uploaded_files_list: {},
    files_left_to_upload: null,
    dragDropFile: function (e) {
        if (Object.keys(UploadAdditional.uploaded_files_list).length < UploadAdditional.limitFiles) {
            UploadAdditional.preloadFiles(e.dataTransfer.files);
        }
        return false;
    },
    updateFileUploadProcess: function (file_tmp_name) {
        var is_online = window.navigator.onLine;
        if (!is_online) {
            var file_block = $("#ModalAdditional .fileload-container .fileload-item[data-file-temp-name='" + file_tmp_name + "']");
            file_block.find('.file_load_progress').hide();
            file_block.find('.file_load_size').hide();
            file_block.addClass('fileload-item-error');
            var error_text = 'Upload failure (no connection).';
            file_block.find('.attachment-error').html(error_text).removeAttr('style');
            return false;
        } else {
            var file_block = $("#ModalAdditional .fileload-container .fileload-item[data-file-temp-name='" + file_tmp_name + "']");
            file_block.removeClass('fileload-item-error');
            var error_text = 'Upload failure (no connection).';
            file_block.find('.attachment-error').html("").removeAttr('style');
        }

        var file_block = $("#ModalAdditional .fileload-item[data-file-temp-name='" + file_tmp_name + "']");
        var current_status = parseInt(file_block.find('.file_load_progress').attr('aria-valuenow'));
        // calculate what part of file can be uploaded in 1/20 of second
        var step_for_progress = 1 / (UploadAdditional.uploaded_files_list[file_tmp_name].size / (internet_speed.value.bytes / 20 /* speed for 1/20 sec */));
        if (step_for_progress > 1) {
            file_block.find('.file_load_progress').attr('aria-valuenow', '100')
                    .find('.progress-bar').css('width', '100%');
        } else {
            var new_status = current_status + (step_for_progress * 100);
            new_status = new_status > 100 ? 100 : new_status;
            file_block.find('.file_load_progress').attr('aria-valuenow', new_status)
                    .find('.progress-bar').css('width', new_status + '%');
        }
    },
    uploadFiles: function (form) {
        if (!uploading_now) {
            

            
            uploading_now = true;
            form.find('[data-submit-modal]').find('.sk-fading-circle').show();
            UploadAdditional.files_left_to_upload = Object.keys(UploadAdditional.uploaded_files_list).length;
            
            

            
            
            
            
            $.each(UploadAdditional.uploaded_files_list, function (file_tmp_name, file_data) {
                var form_data = new FormData();
                form_data.append('file_tmp_name', file_tmp_name);
                form_data.append('files[]', file_data);
                form_data.append('description', $("#ModalAdditional textarea[name='description']").val());
                var file_block = $("#ModalAdditional .fileload-item[data-file-temp-name='" + file_tmp_name + "']");

                file_block.find('.file-load-cancel, .file_load_size').show();
                file_block.find('.file_load_progress').show();

                UploadAdditional.uploaded_files_list[file_tmp_name].interval = setInterval(UploadAdditional.updateFileUploadProcess(file_tmp_name), 50, file_tmp_name); // 1/20 part of secont


                $.ajax({
                    url: 'test?ajax=UploadAdditional', // point to server-side PHP script
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: form_data,
                    method: 'POST',
                    type: 'POST',
                    success: function (data) {
                        console.log("success")
                        if (Object.keys(UploadAdditional.uploaded_files_list).length == 1) {
                            $("#AdditionalSubmitted span.samples").text("sample is")
                        }

                        clearInterval(UploadAdditional.uploaded_files_list[file_tmp_name].interval);
                        UploadAdditional.uploaded_files_list[file_tmp_name].interval = false;

                        file_block.find('.file_load_progress').fadeOut(100, function () {
                            file_block.find('.upload-done-icon, .file_load_size').fadeIn(100);
                        });

                        UploadAdditional.files_left_to_upload--;
                        if (UploadAdditional.files_left_to_upload === 0) {
                            form.find('[data-submit-modal]').find('.sk-fading-circle').hide();
                            setTimeout(function () {
                                uploading_now = false;
                                UploadAdditional.clearModal();
                                setTimeout(function () {
                                    $("#AdditionalSubmitted").modal('show');

                                }, 500);

                            }, 1000);
                        }
                    },
                    error: function (data) {
                        form.find('[data-submit-modal]').find('.sk-fading-circle').hide();

                    }
                });
            }
            );
        }
    },
    clearModal: function () {
        UploadAdditional.uploaded_files_list = {};
        var modal = $("#ModalAdditional");
        modal.modal('hide');
        modal.find(".modal-body > .attachment-error.error-type").hide();
        modal.find(".drop-files--extended__container").removeClass('disabled-upload');
        modal.find(".modal-body .attachment-error.error-count").hide();
        modal.find(".error-files").empty();
        modal.find(".valid-files").empty();
        modal.find("[data-submit-modal]").addClass('submit_btn-disabled');
    },
    checkFiles: function () {
        var check = true;
        if (Object.keys(UploadAdditional.uploaded_files_list).length == 0) {
            check = false;
        }

        //validate files
        var error_uploaded_files = $("#ModalAdditional .fileload-container .error-files .fileload-item");
        $("#ModalAdditional .drop-files--extended__container").removeClass("error");
        if (error_uploaded_files.length > 0) {
            check = false;
        } else {
            //$("#ModalAdditional .modal-body > .attachment-error.error-type").hide();
        }

        //validate posibility to upload files
        if (Object.keys(UploadAdditional.uploaded_files_list).length >= UploadAdditional.limitFiles) {
            $("#dragndrop_sample_files_area").addClass("non-active").tooltip("enable");
            $("#ModalAdditional .drop-files--extended__container").addClass('disabled-upload');
        } else {
            $("#dragndrop_sample_files_area").removeClass("non-active").tooltip("disable");
            $("#ModalAdditional .drop-files--extended__container").removeClass('disabled-upload');
        }

        //validate count files
        if (Object.keys(UploadAdditional.uploaded_files_list).length > UploadAdditional.limitFiles) {
            $("#ModalAdditional .modal-body .attachment-error.error-count").show();
            check = false;
        } else {
            $("#ModalAdditional .modal-body .attachment-error.error-count").hide();
        }

        //button submit
        if (check) {
            $("#ModalAdditional [data-submit-modal]")
                    .removeClass('submit_btn-disabled');
            $("#ModalAdditional .file-load-error").hide();
        } else {
            $("#ModalAdditional [data-submit-modal]")
                    .addClass('submit_btn-disabled');
        }

        return check;
    },
    removeTmpMessageFile: function () {
        var button = $(this),
                file_block = button.parent().closest('.fileload-item');
        delete UploadAdditional.uploaded_files_list[file_block.attr('data-file-temp-name')];
        file_block.slideUp(200, function () {
            $(this).detach();
            UploadAdditional.checkFiles();
        });
    },
    preloadFiles: function (pre_files) {
        if (!pre_files.length) {
            return false;
        }
        var parsed_html_data = {
            error_block: "",
            valid_block: ""
        };

        var files = 0;

        $.each(
                pre_files,
                function (iter, file_data) {

                    if (Object.keys(UploadAdditional.uploaded_files_list).length > UploadAdditional.limitFiles - 1) {
                        return;
                    }

                    var file_name = file_data.name,
                            file_name_transl = rus_to_latin(file_name),
                            tmp_file_name = Date.now() + '---' + Base64.encode(file_name_transl);
                    var valid_ext = checkFileExtension(file_name, ["doc", "docx", "pdf",  "jpg", "jpeg", "png"]);
                    file_data.name = file_name_transl;
                    file_data.interval = false;
                    if (MAX_FILESIZE > file_data.size && valid_ext) {
                        UploadAdditional.uploaded_files_list[tmp_file_name] = file_data;
                    }

                    var validation_errors = {
                        file_size_error: MAX_FILESIZE < file_data.size ? 'File size exceeds 50 Mb' : false,
                        extension_error: valid_ext ? false : 'Wrong file format. Use doc, docx, pdf, jpg, jpeg, png format.'
                    };
                    var file_size_data = parseBytes(file_data.size);
                    var jSmartyObject = new jSmart($("#sample_file_item")[0].innerHTML);
                    var current_html = jSmartyObject.fetch({
                        in_development: in_development,
                        file_data_tmp_name: tmp_file_name,
                        remove_function_name: 'UploadAdditional.removeTmpMessageFile.call(this)',
                        file_data: {
                            name: file_name_transl,
                            cropped_name: croppString(file_name_transl, 25, 7),
                            size: file_size_data.size + " " + file_size_data.size_type
                        },
                        validation_error: validation_errors.file_size_error ?
                                validation_errors.file_size_error
                                : (
                                        validation_errors.extension_error ?
                                        validation_errors.extension_error
                                        : false
                                        )
                    });
                    if (MAX_FILESIZE < file_data.size || !valid_ext) {
                        parsed_html_data.error_block += current_html;
                    } else {
                        parsed_html_data.valid_block += current_html;
                    }
                }
        );
        $("#ModalAdditional .fileload-container .error-files").append(parsed_html_data.error_block);
        $("#ModalAdditional .fileload-container .valid-files").append(parsed_html_data.valid_block);
        UploadAdditional.checkFiles();
        $("#ModalAdditional #files_input").val('');
    }
};
    
    
} else {
    $(document).on('click', '#ModalAdditional [data-submit-modal]', function () {

        if($("#ModalAdditional .submit_btn").hasClass("submit_btn-disabled")){
            return false;
        }
        $("#ModalAdditional .error-english").hide();

        var description = $("#ModalAdditional textarea[name='description']").val();
        var words = $.trim(description).split(" ");
        words = words.length;


        if (words > 50) {
            $("#ModalAdditional .error-50-words").show();
            return false;
        } else {
            $("#ModalAdditional .error-50-words").hide();
        }
        
        
        
        
        callAjax('json', '/test?ajax=AdditionalCommet', function (data) {
                $("#ModalAdditional .request_block").hide();
                $("#ModalAdditional .success-block").show();

            }, {
            description: description,
        });
    });
}


/**
 END Additional
 */

// ----------------------------------------------------------------------------------------------------------








/**
 Start CV Modal
 */


$("#ModalCV").on("show.bs.modal", function () {
    var count_upload_files = $('[data-target="#ModalCV"]').attr('data-count-download-files');
    if (count_upload_files) {
        UploadCV.limitFiles = 3 - count_upload_files;
    }
});
//posible-count-upload-files
$(document).on('change', '#ModalCV [data-form-cv] [name="files[]"]', function () {
    UploadCV.preloadFiles($(this)[0].files);
});
$(document).on('click', '#ModalCV [data-submit-modal]', function () {
    if (!UploadCV.checkFiles()) {
        $("#ModalCV .file-load-error").show();
        return false;
    }


    var description = $("#ModalCV textarea[name='description']").val();
    var words = $.trim(description).split(" ");
    words = words.length;

    if (description.length > 0) {
        var regex = /^[a-zA-Z0-9$@$!%*?&#^-_.\-\"\'\s;` +]+$/g;
        var result = description.match(regex);
        if (result == null) {
            $("#ModalCV .error-english").show();
            return false;
        } else {
            $("#ModalCV .error-english").hide();
        }
    }

    if (words > 50) {
        $("#ModalCV .error-50-words").show();
        return false;
    } else {
        $("#ModalCV .error-50-words").hide();
    }

    UploadCV.uploadFiles($(this).closest('form'));
});
var UploadCV = {
    limitFiles: 3,
    uploaded_files_list: {},
    files_left_to_upload: null,
    dragDropFile: function (e) {
        if (Object.keys(UploadCV.uploaded_files_list).length < UploadCV.limitFiles) {
            UploadCV.preloadFiles(e.dataTransfer.files);
        }
        return false;
    },
    updateFileUploadProcess: function (file_tmp_name) {
        var is_online = window.navigator.onLine;
        if (!is_online) {
            var file_block = $("#ModalCV .fileload-container .fileload-item[data-file-temp-name='" + file_tmp_name + "']");
            file_block.find('.file_load_progress').hide();
            file_block.find('.file_load_size').hide();
            file_block.addClass('fileload-item-error');
            var error_text = 'Upload failure (no connection).';
            file_block.find('.attachment-error').html(error_text).removeAttr('style');
            return false;
        } else {
            var file_block = $("#ModalCV .fileload-container .fileload-item[data-file-temp-name='" + file_tmp_name + "']");
            file_block.removeClass('fileload-item-error');
            var error_text = 'Upload failure (no connection).';
            file_block.find('.attachment-error').html("").removeAttr('style');
        }

        var file_block = $("#ModalCV .fileload-item[data-file-temp-name='" + file_tmp_name + "']");
        var current_status = parseInt(file_block.find('.file_load_progress').attr('aria-valuenow'));
        // calculate what part of file can be uploaded in 1/20 of second
        var step_for_progress = 1 / (UploadCV.uploaded_files_list[file_tmp_name].size / (internet_speed.value.bytes / 20 /* speed for 1/20 sec */));
        if (step_for_progress > 1) {
            file_block.find('.file_load_progress').attr('aria-valuenow', '100')
                    .find('.progress-bar').css('width', '100%');
        } else {
            var new_status = current_status + (step_for_progress * 100);
            new_status = new_status > 100 ? 100 : new_status;
            file_block.find('.file_load_progress').attr('aria-valuenow', new_status)
                    .find('.progress-bar').css('width', new_status + '%');
        }
    },
    uploadFiles: function (form) {
        if (!uploading_now) {
            uploading_now = true;
            form.find('[data-submit-modal]').find('.sk-fading-circle').show();
            UploadCV.files_left_to_upload = Object.keys(UploadCV.uploaded_files_list).length;
            $.each(UploadCV.uploaded_files_list, function (file_tmp_name, file_data) {
                var form_data = new FormData();
                form_data.append('file_tmp_name', file_tmp_name);
                form_data.append('files[]', file_data);
                form_data.append('description', $("#ModalCV textarea[name='description']").val());
                var file_block = $("#ModalCV .fileload-item[data-file-temp-name='" + file_tmp_name + "']");

                file_block.find('.file-load-cancel, .file_load_size').show();
                file_block.find('.file_load_progress').show();



                UploadCV.uploaded_files_list[file_tmp_name].interval = setInterval(UploadCV.updateFileUploadProcess(file_tmp_name), 50, file_tmp_name); // 1/20 part of secont


                $.ajax({
                    url: 'test?ajax=UploadCVNew', // point to server-side PHP script
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: form_data,
                    method: 'POST',
                    type: 'POST',
                    success: function (data) {
                        data = JSON.parse(data)
                        console.log(data);
                        console.log(data.result);
                        console.log(data.result == 1);
                        console.log(data.result == 2);
                        clearInterval(UploadCV.uploaded_files_list[file_tmp_name].interval);
                        UploadCV.uploaded_files_list[file_tmp_name].interval = false;
                        file_block.find('.file_load_progress').fadeOut(100, function () {
                            file_block.find('.upload-done-icon, .file_load_size').fadeIn(100);
                        });
                        UploadCV.files_left_to_upload--;
                        if (UploadCV.files_left_to_upload === 0) {
                            form.find('[data-submit-modal]').find('.sk-fading-circle').hide();


                            setTimeout(function () {
                                uploading_now = false;
                                UploadCV.clearModal();
                                setTimeout(function () {
                                    if (data.result == 1) {
                                        $("#CVSubmitted").modal('show');
                                    } else if (data.result == 2) {
                                        $("#TestCongratulations").modal('show');
                                    }

                                }, 500);

                            }, 1000);


                        }
                    },
                    error: function (data) {
                        form.find('[data-submit-modal]').find('.sk-fading-circle').hide();
                    }
                });
            }
            );
        }
    },
    clearModal: function () {
        UploadCV.uploaded_files_list = {};
        var modal = $("#ModalCV");
        modal.modal('hide');
        modal.find(".modal-body > .attachment-error.error-type").hide();
        modal.find(".drop-files--extended__container").removeClass('disabled-upload');
        modal.find(".modal-body .attachment-error.error-count").hide();
        modal.find(".error-files").empty();
        modal.find(".valid-files").empty();
        modal.find("[data-submit-modal]").addClass('submit_btn-disabled');
    },
    checkFiles: function () {
        var check = true;
        if (Object.keys(UploadCV.uploaded_files_list).length == 0) {
            check = false;
        }

        //validate files
        var error_uploaded_files = $("#ModalCV .fileload-container .error-files .fileload-item");
        $("#ModalCV .drop-files--extended__container").removeClass("error");
        if (error_uploaded_files.length > 0) {
            //$("#ModalCV .modal-body > .attachment-error.error-type").show();
            check = false;
        } else {
            //$("#ModalCV .modal-body > .attachment-error.error-type").hide();
        }

        //validate posibility to upload files
        if (Object.keys(UploadCV.uploaded_files_list).length >= UploadCV.limitFiles) {
            $("#ModalCV .drop-files--extended__container").addClass('disabled-upload');
            $("#dragndrop_cv_files_area").addClass("non-active").tooltip("enable");
        } else {
            $("#ModalCV .drop-files--extended__container").removeClass('disabled-upload');
            $("#dragndrop_cv_files_area").removeClass("non-active").tooltip("disable");
        }

        //validate count files
        if (Object.keys(UploadCV.uploaded_files_list).length > UploadCV.limitFiles) {
            $("#ModalCV .modal-body .attachment-error.error-count").show();
            check = false;
        } else {
            $("#ModalCV .modal-body .attachment-error.error-count").hide();
        }

        //button submit
        if (check) {
            $("#ModalCV [data-submit-modal]")
                    .removeClass('submit_btn-disabled');
            $("#ModalCV .file-load-error").hide();
        } else {
            $("#ModalCV [data-submit-modal]")
                    .addClass('submit_btn-disabled');
        }

        return check;
    },
    removeTmpMessageFile: function () {
        var button = $(this),
                file_block = button.parent().closest('.fileload-item');
        delete UploadCV.uploaded_files_list[file_block.attr('data-file-temp-name')];
        file_block.slideUp(200, function () {
            $(this).detach();
            UploadCV.checkFiles();
        });
    },
    preloadFiles: function (pre_files) {
        if (!pre_files.length) {
            return false;
        }
        var parsed_html_data = {
            error_block: "",
            valid_block: ""
        };
        $.each(
                pre_files,
                function (iter, file_data) {


                    if (Object.keys(UploadCV.uploaded_files_list).length > UploadCV.limitFiles - 1) {
                        return;
                    }

                    var file_name = file_data.name,
                            file_name_transl = rus_to_latin(file_name),
                            tmp_file_name = Date.now() + '---' + Base64.encode(file_name_transl);
                    var valid_ext = checkFileExtension(file_name, ["doc", "docx", "pdf", ]);
                    file_data.name = file_name_transl;
                    file_data.interval = false;
                    if (MAX_FILESIZE > file_data.size && valid_ext) {
                        UploadCV.uploaded_files_list[tmp_file_name] = file_data;
                    }

                    var validation_errors = {
                        file_size_error: MAX_FILESIZE < file_data.size ? 'File size exceeds 50 Mb' : false,
                        extension_error: valid_ext ? false : 'Wrong file format. Use doc, docx, pdf format.'
                    };
                    var file_size_data = parseBytes(file_data.size);
                    var jSmartyObject = new jSmart($("#cv_file_item")[0].innerHTML);
                    var current_html = jSmartyObject.fetch({
                        in_development: in_development,
                        file_data_tmp_name: tmp_file_name,
                        remove_function_name: 'UploadCV.removeTmpMessageFile.call(this)',
                        file_data: {
                            name: file_name_transl,
                            cropped_name: croppString(file_name_transl, 25, 7),
                            size: file_size_data.size + " " + file_size_data.size_type
                        },
                        validation_error: validation_errors.file_size_error ?
                                validation_errors.file_size_error
                                : (
                                        validation_errors.extension_error ?
                                        validation_errors.extension_error
                                        : false
                                        )
                    });
                    if (MAX_FILESIZE < file_data.size || !valid_ext) {
                        parsed_html_data.error_block += current_html;
                    } else {
                        parsed_html_data.valid_block += current_html;
                    }
                }
        );
        $("#ModalCV .fileload-container .error-files").append(parsed_html_data.error_block);
        $("#ModalCV .fileload-container .valid-files").append(parsed_html_data.valid_block);
        UploadCV.checkFiles();
        $("#ModalCV #files_input").val('');
    }


}
/**
 END CV Modal
 */


// ----------------------------------------------------------------------------------------------------------
/**
 Start Diploma Modal
 */

$("#ModalDiploma").on("show.bs.modal", function () {
    var count_upload_files = $('[data-target="#ModalDiploma"]').attr('data-count-download-files');
    if (count_upload_files) {
        UploadDiploma.limitFiles = 3 - count_upload_files;
    }
});

//posible-count-upload-files
$(document).on('change', '#ModalDiploma [data-form-diploma] [name="files[]"]', function () {
    UploadDiploma.preloadFiles($(this)[0].files);
});

$(document).on('click', '#ModalDiploma [data-submit-modal]', function () {
    if (!UploadDiploma.checkFiles()) {
        $("#ModalDiploma .file-load-error").show();
        return false;
    }


    var description = $("#ModalDiploma textarea[name='description']").val();
    var words = $.trim(description).split(" ");
    words = words.length;

    if (description.length > 0) {
        var regex = /^[a-zA-Z0-9$@$!%*?&#^-_.\-\"\'\s;` +]+$/g;
        var result = description.match(regex);
        if (result == null) {
            $("#ModalDiploma .error-english").show();
            return false;
        } else {
            $("#ModalDiploma .error-english").hide();
        }
    }

    if (words > 50) {
        $("#ModalDiploma .error-50-words").show();
        return false;
    } else {
        $("#ModalDiploma .error-50-words").hide();
    }

    UploadDiploma.uploadFiles($(this).closest('form'));
});

var UploadDiploma = {
    limitFiles: 3,
    uploaded_files_list: {},
    files_left_to_upload: null,
    dragDropFile: function (e) {
        if (Object.keys(UploadDiploma.uploaded_files_list).length < UploadDiploma.limitFiles) {
            UploadDiploma.preloadFiles(e.dataTransfer.files);
        }
        return false;
    },
    updateFileUploadProcess: function (file_tmp_name) {
        var is_online = window.navigator.onLine;
        if (!is_online) {
            var file_block = $("#ModalDiploma .fileload-container .fileload-item[data-file-temp-name='" + file_tmp_name + "']");
            file_block.find('.file_load_progress').hide();
            file_block.find('.file_load_size').hide();
            file_block.addClass('fileload-item-error');
            var error_text = 'Upload failure (no connection).';
            file_block.find('.attachment-error').html(error_text).removeAttr('style');
            return false;
        } else {
            var file_block = $("#ModalDiploma .fileload-container .fileload-item[data-file-temp-name='" + file_tmp_name + "']");
            file_block.removeClass('fileload-item-error');
            var error_text = 'Upload failure (no connection).';
            file_block.find('.attachment-error').html("").removeAttr('style');
        }


        var file_block = $("#ModalDiploma .fileload-item[data-file-temp-name='" + file_tmp_name + "']");
        var current_status = parseInt(file_block.find('.file_load_progress').attr('aria-valuenow'));

        // calculate what part of file can be uploaded in 1/20 of second
        var step_for_progress = 1 / (UploadDiploma.uploaded_files_list[file_tmp_name].size / (internet_speed.value.bytes / 20 /* speed for 1/20 sec */));

        if (step_for_progress > 1) {
            file_block.find('.file_load_progress').attr('aria-valuenow', '100')
                    .find('.progress-bar').css('width', '100%');
        } else {
            var new_status = current_status + (step_for_progress * 100);

            new_status = new_status > 100 ? 100 : new_status;

            file_block.find('.file_load_progress').attr('aria-valuenow', new_status)
                    .find('.progress-bar').css('width', new_status + '%');

        }
    },
    uploadFiles: function (form) {
        if (!uploading_now) {
            uploading_now = true;

            form.find('[data-submit-modal]').find('.sk-fading-circle').show();

            UploadDiploma.files_left_to_upload = Object.keys(UploadDiploma.uploaded_files_list).length;

            $.each(UploadDiploma.uploaded_files_list, function (file_tmp_name, file_data) {
                var form_data = new FormData();
                form_data.append('file_tmp_name', file_tmp_name);
                form_data.append('files[]', file_data);
                form_data.append('description', $("#ModalDiploma textarea[name='description']").val());


                var file_block = $("#ModalDiploma .fileload-item[data-file-temp-name='" + file_tmp_name + "']");

                file_block.find('.file-load-cancel, .file_load_size').show();
                file_block.find('.file_load_progress').show();


                UploadDiploma.uploaded_files_list[file_tmp_name].interval = setInterval(UploadDiploma.updateFileUploadProcess(file_tmp_name), 50, file_tmp_name); // 1/20 part of secont

                $.ajax({
                    url: 'test?ajax=UploadDiplomaNew', // point to server-side PHP script
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: form_data,
                    method: 'POST',
                    type: 'POST',
                    success: function (data) {
                        data = JSON.parse(data)

                        clearInterval(UploadDiploma.uploaded_files_list[file_tmp_name].interval);
                        UploadDiploma.uploaded_files_list[file_tmp_name].interval = false;

                        file_block.find('.file_load_progress').fadeOut(100, function () {
                            file_block.find('.upload-done-icon, .file_load_size').fadeIn(100);
                        });

                        UploadDiploma.files_left_to_upload--;
                        if (UploadDiploma.files_left_to_upload === 0) {
                            form.find('[data-submit-modal]').find('.sk-fading-circle').hide();
                            setTimeout(function () {
                                UploadDiploma.clearModal();
                                setTimeout(function () {
                                    uploading_now = false;
                                    if (data.result == 1) {
                                        $("#DiplomaSubmitted").modal('show');
                                    } else if (data.result == 2) {
                                        $("#TestCongratulations").modal('show');
                                    }
                                }, 500);
                            }, 1000);
                        }

                    },
                    error: function (data) {
                        form.find('[data-submit-modal]').find('.sk-fading-circle').hide();
                    }
                });
            }
            );
        }
    },
    clearModal: function () {
        UploadDiploma.uploaded_files_list = {};
        var modal = $("#ModalDiploma");
        modal.modal('hide');
        modal.find(".modal-body > .attachment-error.error-type").hide();
        modal.find(".drop-files--extended__container").removeClass('disabled-upload');
        modal.find(".modal-body .attachment-error.error-count").hide();
        modal.find(".error-files").empty();
        modal.find(".valid-files").empty();
        modal.find("[data-submit-modal]").addClass('submit_btn-disabled');

    },
    checkFiles: function () {
        var check = true;

        if (Object.keys(UploadDiploma.uploaded_files_list).length == 0) {
            check = false;
        }

        //validate files
        var error_uploaded_files = $("#ModalDiploma .fileload-container .error-files .fileload-item");
        $("#ModalDiploma .drop-files--extended__container").removeClass("error");
        if (error_uploaded_files.length > 0) {
            $("#ModalDiploma .modal-body > .attachment-error.error-type").show();
            check = false;
        } else {
            $("#ModalDiploma .modal-body > .attachment-error.error-type").hide();
        }

        //validate posibility to upload files
        if (Object.keys(UploadDiploma.uploaded_files_list).length >= UploadDiploma.limitFiles) {
            $("#ModalDiploma .drop-files--extended__container").addClass('disabled-upload');
            $("#dragndrop_diploma_files_area").addClass("non-active").tooltip("enable");
        } else {
            $("#ModalDiploma .drop-files--extended__container").removeClass('disabled-upload');
            $("#dragndrop_diploma_files_area").removeClass("non-active").tooltip("disable");
        }

        //validate count files
        if (Object.keys(UploadDiploma.uploaded_files_list).length > UploadDiploma.limitFiles) {
            $("#ModalDiploma .modal-body .attachment-error.error-count").show();
            check = false;
        } else {
            $("#ModalDiploma .modal-body .attachment-error.error-count").hide();
        }

        //button submit
        if (check) {
            $("#ModalDiploma [data-submit-modal]")
                    .removeClass('submit_btn-disabled');
            $("#ModalDiploma .file-load-error").hide();
        } else {
            $("#ModalDiploma [data-submit-modal]")
                    .addClass('submit_btn-disabled');
        }

        return check;
    },

    removeTmpMessageFile: function () {
        var button = $(this),
                file_block = button.parent().closest('.fileload-item');

        delete UploadDiploma.uploaded_files_list[file_block.attr('data-file-temp-name')];

        file_block.slideUp(200, function () {
            $(this).detach();

            UploadDiploma.checkFiles();
        });
    },

    preloadFiles: function (pre_files) {
        if (!pre_files.length) {
            return false;
        }
        var parsed_html_data = {
            error_block: "",
            valid_block: ""
        };

        $.each(
                pre_files,
                function (iter, file_data) {

                    if (Object.keys(UploadDiploma.uploaded_files_list).length > UploadDiploma.limitFiles - 1) {
                        return;
                    }

                    var file_name = file_data.name,
                            file_name_transl = rus_to_latin(file_name),
                            tmp_file_name = Date.now() + '---' + Base64.encode(file_name_transl);

                    var valid_ext = checkFileExtension(file_name, ["jpg", "jpeg"]);

                    file_data.name = file_name_transl;
                    file_data.interval = false;
                    if (MAX_FILESIZE > file_data.size && valid_ext) {
                        UploadDiploma.uploaded_files_list[tmp_file_name] = file_data;
                    }

                    var validation_errors = {
                        file_size_error: MAX_FILESIZE < file_data.size ? 'File size exceeds 50 Mb' : false,
                        extension_error: valid_ext ? false : 'Wrong file format. Use jpg, jpeg format.'
                    };

                    var file_size_data = parseBytes(file_data.size);

                    var jSmartyObject = new jSmart($("#diploma_file_item")[0].innerHTML);
                    var current_html = jSmartyObject.fetch({
                        in_development: in_development,
                        file_data_tmp_name: tmp_file_name,
                        remove_function_name: 'UploadDiploma.removeTmpMessageFile.call(this)',
                        file_data: {
                            name: file_name_transl,
                            cropped_name: croppString(file_name_transl, 25, 7),
                            size: file_size_data.size + " " + file_size_data.size_type
                        },
                        validation_error: validation_errors.file_size_error ?
                                validation_errors.file_size_error
                                : (
                                        validation_errors.extension_error ?
                                        validation_errors.extension_error
                                        : false
                                        )
                    });

                    if (MAX_FILESIZE < file_data.size || !valid_ext) {
                        parsed_html_data.error_block += current_html;
                    } else {
                        parsed_html_data.valid_block += current_html;
                    }
                }
        );

        $("#ModalDiploma .fileload-container .error-files").append(parsed_html_data.error_block);
        $("#ModalDiploma .fileload-container .valid-files").append(parsed_html_data.valid_block);

        UploadDiploma.checkFiles();

        $("#ModalDiploma #files_input").val('');
    }
};
/**
 END Diploma Modal
 */

//SLIDE CAROUSEL MOBILE
$(document).on("click", "[data-load-req-renefits]", function () {
    $(this).toggleClass('btn-load-rotate');
    $(this).parents().find('.carousel-body').slideToggle('slow');

    if ($(this).hasClass('btn-load-rotate')) {
        $(this).html('Hide');
    } else {
        $(this).html('Details');
    }
});
//END SLIDE CAROUSEL MOBILE

//ADD CLASS TO ARROW WHEN LAST SLIDE
function checkitem() {
    var $this;
    $this = $(".carousel");
    if ($(".carousel .carousel-inner .carousel-item:first").hasClass("active")) {
        $this.children(".carousel-control-prev").addClass('carousel-arrow-dissabled');
        $this.children(".carousel-control-next").removeClass('carousel-arrow-dissabled');
    } else if ($("#carouselPerformanceOverview .carousel-inner .carousel-item:last").hasClass("active")) {
        $this.children(".carousel-control-prev").removeClass('carousel-arrow-dissabled');
        $this.children(".carousel-control-next").addClass('carousel-arrow-dissabled');
    } else {
        $this.children(".carousel-control-prev").removeClass('carousel-arrow-dissabled');
        $this.children(".carousel-control-next").removeClass('carousel-arrow-dissabled');
        $this.children(".carousel-control").removeClass('carousel-arrow-dissabled');
    }
};


$(document).on("slid.bs.carousel", ".carousel", function () {
    checkitem();
});

//END ADD CLASS TO ARROW WHEN LAST SLIDE


validationFormByConfig($("#get_a_promotion_form"), function ($form, $input) {
    validateButtonSubmit($form);
}, function ($form, $input) {
    validateButtonSubmit($form);
});

$('#get_a_promotion_form').on("submit", function () {
    event.preventDefault();
    var form_promotion = $(this);
    form_promotion.find('[data-submit-form]').find('.sk-fading-circle').show();
    var group_id = form_promotion.find('select[name="promotion_group"]').val();
    var reason = form_promotion.find('textarea[name="promotion_reason"]').val();
    if (!form_promotion.valid()) {
        form_promotion.find('[data-submit-form]').find('.sk-fading-circle').hide();
        return false;
    }
    callAjax('json', '/profile?ajax=promotion', function (data) {
        if (data.result.ok == 'ok') {
            $('[data-ajax-load-page].active').trigger('click');
            $("#ModalGetPromotion").modal('hide');
            $("#GetPromotionSuccess").modal('show');
            setTimeout(function(){
                $("#GetPromotionSuccess").modal('hide');
            }, 3000);
        } else {
            form_promotion.find('[data-submit-form]').find('.sk-fading-circle').hide();
            console.warn('error', 'Error', data);
        }
    }, {group: group_id, reason: reason});
});

function setListFlowHigherLevels(list_higher_levels) {
    var i;
    var options = '';
    for (i = 0; i < list_higher_levels.length; i++) {
        options += "<option value='" + list_higher_levels[i]['writer_group_id'] + "' >" + list_higher_levels[i]['name'] + "</option>";
    }
    $('[data-select-promotion]').html(options);
}

function initPerformanceOverview() {

    $('[data-feedback-block]').html(loader);
    callAjax('json', '/performance_overview?ajax=getFeedbackList', function (data) {

        var tpl = new jSmart($('#feedback_template').html());
        var holder = $('[data-feedback-block]');
        holder.empty();
        var template_values = {};
        template_values['stats'] = data.stats_feedback;
        template_values.current_user = CURRENT_USER;
        holder.append(tpl.fetch(template_values));

        if ($('[data-review-hide]').length > 0) {
            $('[data-load-reviews]').show();
        }

    });

    $(".performance-overview-page .table-sort-list").each(function(){
        if($(this).find("a").length > 1){
            $(this).find("a").each(function(index){
                if (index > 0){
                    $(this).hide();
                }else{
                    $(this).closest(".table-sort-list").append('<div class="open-block"></div>');
                }
            });
        }    
    });

    $(document).on("click", "[data-load-reviews]", function () {
        $("[data-review-hide]").each(function (index) {
            if (index < 10) {
                $(this).show();
                $(this).removeAttr('data-review-hide');
            }
        });
        if ($('[data-review-hide]').length == 0) {
            $('[data-load-reviews]').hide();
        }
    });

    checkitem();

}

//fix swipe carousel
$('.carousel').on('touchstart', function(event){
    const xClick = event.originalEvent.touches[0].pageX;
    $(this).one('touchmove', function(event){
        const xMove = event.originalEvent.touches[0].pageX;
        const sensitivityInPx = 5;

        if( Math.floor(xClick - xMove) > sensitivityInPx ){
            $(this).carousel('next');
        }
        else if( Math.floor(xClick - xMove) < -sensitivityInPx ){
            $(this).carousel('prev');
        }
    });
    $(this).on('touchend', function(){
        $(this).off('touchmove');
    });
});
//END fix swipe carousel

//DropDown in List orders
$(document).on("click", ".performance-overview-page .table-sort-list .open-block", function () {
    $(this).toggleClass("open");
    $(this).closest(".table-sort-list").find("a").each(function(index){
        if (index > 0){
            $(this).toggle();
        }
    });
});
//END DropDown in List orders
/*Show knowledge test box*/
$(document).on("click", "[data-proceed-quiz]", function () {
    $(this).parents().find('.knowledge-quiz-preview').hide();
    $(this).parents().find('[data-show-knowledge-test]').fadeIn();
});
/*END Show knowledge test box*/

$(document).on('click', '.quiz_submit_btn', function() {
    if($(this).hasClass('submit_btn-disabled')) return false;
    test_check();
});

$(document).on('change', '.knowledge-radio-wrapper label input', function() {
     var check = true;
        $("input:radio").each(function(){
            var name = $(this).attr("name");
            if($("input:radio[name="+name+"]:checked").length == 0){
                check = false;
                $('.quiz_submit_error').show();
            }
        });
    
    if(check) {
        $('.quiz_submit_btn').removeClass('submit_btn-disabled');
        $('.quiz_submit_error').hide();
    }
})

$(window).on("beforeunload", function() {
    if(window.location.pathname.replace('/', '') == 'quiz' && $('.knowledge-quiz-preview:hidden').length > 0) {
        return false;
    }
});

$("#KnowledgeTestNotPass, #KnowledgeTestCongratulations").find(".submit_btn").on("click", function() {
    $(window).off('beforeunload');
    location.reload();
});

$(document).on("click","#KnowledgeTestLeaving [data_leave_href]", function() {
    var loc = $(this).attr('data_leave_href');
    $(this).removeAttr('data_leave_href');
    document.location.href=loc
});

function test_check() {
    var correct_answers = $("#dexter").attr("value") / 785,
    correct_answers = correct_answers.toString().split(''),
    array_lenght = correct_answers.length,
    test_passed = true;
    for (var i = 0; i < array_lenght; i++) {
        var radio_id = "#radio_" + (i + 1) + "_" + correct_answers[i];
        if ($(radio_id).prop("checked")) {
            continue;
        } else {
           test_passed = false;
        }
    }
    if(test_passed) {
        $('#KnowledgeTestCongratulations').modal('show');
    } else {
        $('#KnowledgeTestNotPass').modal('show');
        return false;
    }
      
    var id = $("#quiz_id").attr("value");
    callAjax("json", "/quiz?ajax=Passed", function(data) {
        if (data.result == "ok") {
                      
        }
    }, {"quiz_id": id});


}
document.addEventListener("DOMContentLoaded", function(){
    $(".card-body").on('click', function (e) {
        if (e.target.tagName.toLowerCase() === 'a') {
            e.stopPropagation();
        } else {
            $(this).parents(".card").find(".card-header a").trigger('click');
        }
    });


    //copy referal link
    var copy_texts = {
        default: 'Copy',
        copied: 'Copied'
    };

    function copyToClipboard(text) {
        var temp = $("<input style='position:absolute;top:-999999px'>");
        $("body").append(temp);
        temp.val(text).select();
        document.execCommand("copy");
        temp.detach();
    }

    function changeCopyText(button_obj) {
        button_obj.addClass('has-copied').html(copy_texts.copied);

        setTimeout(function() {
            button_obj.removeClass('has-copied').html(copy_texts.default);
        }, 5000);
    }

    $(document).on('click', '#button-copy, #button-copy-link', function() {    
        copyToClipboard($(this).closest('.input-group').find('.form-control').text());
        changeCopyText($(this));
    });

});
function copytext(el) {
    $(".tooltiptext").each(function(){
        $(this).text("Copy")
    });
    let $tmp = $("<textarea>");
        $("body").append($tmp);
        $tmp.val($(el).text()).select();
        document.execCommand("copy");
        $tmp.remove();
        $(el).next(".tooltiptext").text("Copied")
    }         
    
    $(document).on('click', '.card-body', function(e) {
        if(e.target.tagName.toLowerCase() === 'a'){
            e.stopPropagation();
        }else{
             $(this).parents(".card").find(".card-header a").trigger('click');
        }       
    });
    
    //simple accordion
    $(document).on("click",'.item-block', function() {
        $(".item-block").each(function(){
            $(this).removeClass("open");
        });
        $(this).addClass("open");
    });