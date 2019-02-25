// ==UserScript==
// @name         Tumblr Dashboard Plug-ins
// @version      0.1
// @namespace    https://greasyfork.org/users/65414
// @description  Additional options and features for Tumblr, including an Accessibility UI design toggle
// @match        http://*.tumblr.com/*
// @match        https://*.tumblr.com/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @run-at       document-start
// ==/UserScript==

(function($){

    let version = GM_info.script.version, lang = $('html').attr('lang').split('-')[0],

        plugin = {

            main: {

                functions: {

                    cfg: { //adds plug-in management section to dashboard settings page

                        context: ['.com/settings/dashboard'],
                        func:

                        function(){
                            let cfg = setInterval(function(){
                                if (!$('.dashboardPlugins-cfg').length){
                                    $('.settings_group.interface').after($('.settings_group.interface').clone().removeClass('interface').addClass('dashboardPlugins-cfg editor'));
                                    $('.dashboardPlugins-cfg .setting:not(:last)').remove();
                                    $('.dashboardPlugins-cfg .group_label').addClass('media-holder');
                                    $('.dashboardPlugins-cfg .group_label').append($('<span>').addClass('dashboardPlugins-btn media-button media-killer icon_editor_plus invis').attr('id','user_findPlugins'));
                                    $('.dashboardPlugins-cfg .setting').removeClass('checkbox').addClass('placeholder media-holder invis').append($('<span>').addClass('dashboardPlugins-btn media-button media-killer icon_editor_plus').attr('id','user_findPlugins'));
                                    $('.dashboardPlugins-cfg .setting label').text(plugin.main.str.cfg.settings_group[lang].split('|')[1]);
                                    $('.dashboardPlugins-cfg .setting .binary_switch').remove();
                                    $('.dashboardPlugins-cfg .settings_subheading').text(plugin.main.str.cfg.settings_group[lang].split('|')[0]);
                                } else {
                                    if (Object.keys(plugin).length <= 1){
                                        $('.dashboardPlugins-cfg .group_label .dashboardPlugins-btn').addClass('invis');
                                        $('.dashboardPlugins-cfg .setting.placeholder').removeClass('invis');
                                    }
                                    $.each(Object.keys(plugin), function(index, id){
                                        if (id !== 'main') {
                                            $('.dashboardPlugins-cfg .group_label .dashboardPlugins-btn').removeClass('invis');
                                            if (!$('#user_enable_' + id).length && $('.dashboardPlugins-cfg.group_content').length !== plugin.length){
                                                if('str' in plugin[id]){
                                                    $('.dashboardPlugins-cfg .group_content').append( plugin[id].str[lang].indexOf('|') > -1 ? $('.interface .group_content > div p').closest('.checkbox').clone()
                                                                                                                                             : $('.interface .checkbox:last').clone());
                                                    $('.dashboardPlugins-cfg .checkbox:last').addClass('media-holder').append($('<span>').addClass('dashboardPlugins-btn media-button media-killer icon_close').attr('id','user_uninstall_' + id));
                                                    $('.dashboardPlugins-cfg .checkbox:last label:last').attr('for', 'user_enable_' + id).text( plugin[id].str[lang].split('|')[0] );
                                                    if ($('.dashboardPlugins-cfg .checkbox:last p').length) {
                                                        $('.dashboardPlugins-cfg .checkbox:last p').text( plugin[id].str[lang].split('|')[1])
                                                    };
                                                    $('.dashboardPlugins-cfg .checkbox:last input').prop('checked', plugin[id].pref.toggle).attr({id: 'user_enable_' + id, name: 'user[enable_' + id + ']'}).removeAttr('value');

                                                    $(document).on('click', '#user_uninstall_' + id, function(){
                                                        localStorage.removeItem('dashboardPlugins-' + id);
                                                        $('#user_uninstall_' + id).closest('.setting').addClass('invis');
                                                        setTimeout(function(){
                                                            $('#user_uninstall_' + id).closest('.setting').remove();
                                                            if (!$('.dashboardPlugins-cfg .checkbox').length){
                                                                $('.dashboardPlugins-cfg .group_label .dashboardPlugins-btn').addClass('invis');
                                                                $('.dashboardPlugins-cfg .setting.placeholder').removeClass('invis');
                                                            }
                                                        }, 300)
                                                    });

                                                    $(document).on('click', '#user_findPlugins', function(){
                                                        window.location.href = '/dashboard/blog/dashboard-plugins';
                                                    });

                                                    $(document).on('click', '#user_enable_' + id, function(){
                                                        plugin[id].pref.toggle = !plugin[id].pref.toggle;
                                                        localStorage.setItem('dashboardPlugins-' + id, JSON.stringify(plugin[id], function(key, value) {
                                                            return (typeof value === 'function' ? value.toString() : value );
                                                        }));
                                                        if ('func' in plugin[id]) {
                                                            plugin[id].func(plugin[id].pref.toggle)
                                                        }
                                                    })
                                                }
                                            } else {
                                                clearInterval(cfg);
                                            }
                                        }
                                    })
                                }
                            }, 1);
                        },
                    },
                },

                str: {

                    cfg: {

                        settings_group: {

                            de: "Plugins|Niets geïnstalleerd|Voeg meer toe",
                            fr: "x|x|Ajouter plus",
                            it: "x|x|Aggiungere altro",
                            ja: "x|x|さらに追加",
                            tr: "x|x|Daha ekle",
                            es: "x|x|Añadir más",
                            ru: "x|x|Добавить больше",
                            pl: "x|x|Dodaj więcej",
                            pt: "x|x|Adicione mais",
                            nl: "Plugins|Niets geïnstalleerd|Voeg meer toe",
                            ko: "플러그인|x|더 추가하기",
                            zh: "插件|x|添加更多",
                            id: "Pengaya|x|Tambah lagi",
                            hi: "प्लगइन्स|x|अधिक जोड़ें",
                            en: "Plug-ins|Nothing installed|Add more",
                        },
                    },

                    general: {

                        de: "x|x|x",
                        fr: "x|x|x",
                        it: "x|x|x",
                        ja: "x|x|x",
                        tr: "x|x|x",
                        es: "x|x|x",
                        ru: "x|x|x",
                        pl: "x|x|x",
                        pt: "x|x|x",
                        nl: "x|x|x",
                        ko: "x|x|x",
                        zh: "x|x|x",
                        id: "x|x|x",
                        hi: "x|x|x",
                        en: "What's this?|x|x",
                    },
                },

                css: {

                    cfg: {

                        context: ['.com/settings/dashboard'],
                        sheet:
                            `.flag--dashboardPlugins .invis {
                                opacity: 0 !important;
                                pointer-events: none !important;
                            }

                            .flag--dashboardPlugins .inline_notification {
                                border: 2px solid #fff;
                                margin: -2px;
                                border-radius: 4px;
                            }

                            .flag--dashboardPlugins .inline_notification.pre_animation {
                                pointer-events: none;
                            }

                            .flag--dashboardPlugins .dashboardPlugins-cfg {
                                min-height: 64px;
                            }

                            .flag--dashboardPlugins .dashboardPlugins-cfg .setting {
                                transform: scaleY(1);
                                padding-right: 50px !important;
                                margin-right: 0px !important;
                                background: white;
                                transition: .2s ease;
                            }

                            .flag--dashboardPlugins .dashboardPlugins-cfg .setting.placeholder {
                                height: 0px;
                                margin: 0px;
                                color: #999;
                                transition-delay: .4s;
                                padding-left: 0px;
                            }

                            .flag--dashboardPlugins .settings_group.dashboardPlugins-cfg .dashboardPlugins-btn.icon_editor_plus {
                                transition-delay: .42s;
                            }

                            .flag--dashboardPlugins .dashboardPlugins-cfg .setting.checkbox:last-of-type {
                                margin-bottom: -20px;
                                padding-bottom: 20px;
                            }

                            .flag--dashboardPlugins .dashboardPlugins-cfg .setting.checkbox:not(:last-of-type) {
                                padding-bottom: 10px;
                                margin-bottom: 0px;
                            }

                            .flag--dashboardPlugins .dashboardPlugins-cfg .setting.checkbox .help_text {
                                margin: 0 0 10px;
                            }

                            .flag--dashboardPlugins .dashboardPlugins-cfg .setting.checkbox:last-of-type .help_text {
                                margin: 0px;
                                padding-bottom: 0px;
                            }

                            .flag--dashboardPlugins .dashboardPlugins-cfg .setting.checkbox.invis {
                                transform: scale(0.7);
                            }

                            .flag--dashboardPlugins .dashboardPlugins-cfg .dashboardPlugins-btn {
                                transition-delay: .05s;
                            }

                            .flag--dashboardPlugins .dashboardPlugins-cfg .setting .dashboardPlugins-btn {
                                top: 0px;
                                right: 53px;
                            }

                            .flag--dashboardPlugins .dashboardPlugins-cfg .group_label .dashboardPlugins-btn {
                                top: -2px;
                                right: 31px;
                            }

                            .flag--dashboardPlugins .settings_group.dashboardPlugins-cfg .dashboardPlugins-btn.icon_editor_plus {
                                font-size: 25px;
                                background: none;
                                color: #56bc8a;
                            }

                            .flag--dashboardPlugins .dashboardPlugins-cfg span.dashboardPlugins-btn.invis, .flag--dashboardPlugins .dashboardPlugins-cfg .invis dashboardPlugins-btn {
                                transform: scale(0);
                            }

                            .flag--dashboardPlugins .flag--accessibility-design-update .dashboardPlugins-cfg .setting.placeholder .dashboardPlugins-btn, .flag--dashboardPlugins .flag--accessibility-design-update .dashboardPlugins-cfg .group_label .dashboardPlugins-btn {
                                color: #00cf35;
                            }

                            .flag--dashboardPlugins .dashboardPlugins-cfg .dashboardPlugins-btn.icon_editor_plus:before {
                                left: -3px;
                            }

                            .flag--dashboardPlugins .dashboardPlugins-cfg .setting.checkbox:hover .dashboardPlugins-btn, .flag--dashboardPlugins .dashboardPlugins-cfg .dashboardPlugins-btn.icon_editor_plus {
                                transform: scale(1);
                                opacity: 1;
                                pointer-events: all;
                                transition-delay: 0s;
                            }`
                    },
                },
            },
        },

        init = //loads and runs main, and installed plug-ins

                $('html').addClass('flag--dashboardPlugins');

                $.each(Object.keys(localStorage), function(i,id){
                    if (id.indexOf('dashboardPlugins-') > -1) {
                        plugin[id.split('-')[1]] = new Object(JSON.parse(localStorage.getItem(id)));
                    }
                });

                $.each(Object.keys(plugin), function(i,pluginId){

                    if ('functions' in plugin[pluginId]) {
                        $.each(Object.keys(plugin[pluginId].functions), function(i,funcId){
                            if (!('context' in plugin[pluginId].functions[funcId]) || plugin[pluginId].functions[funcId].context.every(function(i){return window.location.href.indexOf(i) > -1})){
                                plugin[pluginId].functions[funcId].func = eval('(' + plugin[pluginId].functions[funcId].func + ')');
                                plugin[pluginId].functions[funcId].func();
                            }
                        });
                    };

                    if ('css' in plugin[pluginId]){
                        $.each(Object.keys(plugin[pluginId].css), function(i,cssId){
                            if ($('link[href*="' + plugin[pluginId].css[cssId].match + '"]').length
                                || ((!('match' in plugin[pluginId].css[cssId]) && !('context' in plugin[pluginId].css[cssId]))
                                    || (('context' in plugin[pluginId].css[cssId]) && plugin[pluginId].css[cssId].context.every(function(i){return window.location.href.indexOf(i) > -1}))
                                    )
                                ){
                                $('head').append($('<style>').attr({type: 'text/css', class: 'dashboardPlugins-' + pluginId + '-' + cssId}).text(plugin[pluginId].css[cssId].sheet))
                            }
                        })
                    };
                });
})(jQuery)