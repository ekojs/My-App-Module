Ext.application({
    name: 'Fiddle',

    launch: function() {
        addressModel = Ext.define("Addresses", {
            extend: 'Ext.data.Model',
            proxy: {
                type: 'jsonp',
                url: 'https://jsonp.nodejitsu.com',
                reader: {
                    type: 'json',
                    root: 'results',
                    totalProperty: 'totalCount'
                }
            },

            fields: ['formatted_address']
        });

        var ds = Ext.create('Ext.data.Store', {
            model: 'Addresses'
        });


        var panel = Ext.create('Ext.panel.Panel', {
            renderTo: Ext.getBody(),
            title: 'Search the Addresses',
            width: 600,
            bodyPadding: 10,
            layout: 'anchor',

            items: [{
                xtype: 'combo',
                store: ds,
                displayField: 'title',
                typeAhead: false,
                hideLabel: true,
                hideTrigger: true,
                anchor: '100%',
                enableKeyEvents: true,

                listConfig: {
                    loadingText: 'Searching...',
                    emptyText: 'No matching posts found.',

                    // Custom rendering template for each item
                    getInnerTpl: function() {
                        return '<div class="search-item">{formatted_address}</div>';
                    }
                },

                // override default onSelect to do redirect
                listeners: {
                    select: function(combo, selection) {
                        var address = selection[0];
                        if (address) {
                            alert('you picked ' + address.data.formatted_address);
                        }
                    },
                    keyup: function(combo) {
                        queryString = combo.getValue();
                        console.log(queryString);
                        console.log(addressModel);
                        addressModel.getProxy().setExtraParam('url', 'https://jsonp.nodejitsu.com/?url=http://maps.google.com/maps/api/geocode/json?address=' + queryString + '&sensor=false');
                    }
                }
            }, {
                xtype: 'component',
                style: 'margin-top:10px',
                html: 'Live search requires a minimum of 4 characters.'
            }]
        });
    }
});
