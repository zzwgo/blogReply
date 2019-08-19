Ext.onReady(function () {
    var toolbar = new Ext.Toolbar({
        items: [
            {
                text: "Edit",
                menu: new Ext.menu.Menu({
                    items: [{
                        text: "Reset",
                        handler: function () {
                            Ext.getCmp("myform").getForm().reset();
                        }
                    }
                    ]
                })
            }, {
                text: "Insert",
                menu: new Ext.menu.Menu({
                    items: [{
                        text: "Table",
                        handler: function () {
                            tableWindow.show()
                        }
                    }
                    ]
                })
            }
        ]
    });

    var clickMenu = new Ext.menu.Menu({
        items: [{
            text: "Insert",
            handler: function () {
                tableWindow.show()
            }
        },
            {
                text: "Reset",
                handler: function () {
                    Ext.getCmp("myform").getForm().reset();
                }
            }
        ]
    });

    var handleTalbe=function () {
        var col=Ext.getCmp("col").getValue();
        var row=Ext.getCmp("row").getValue();
        genTable(row,col);

    };

    var tableData = [];
    var genTable=function (row,col) {
        tableData = [];
        for (let i = 0; i < row; i++) {
            tableData[i] = [];
            for (let j = 0; j < col; j++) {
                tableData[i][j] = []
            }
        }
        renderTable();
    };

    var  renderTable=function() {
        var tpl = new Ext.XTemplate(
            '<table border="1">',
            '<tpl for="values">',
            '<tr>',
            '<tpl for="values">',
            '<td>&nbsp&nbsp&nbsp&nbsp&nbsp</td>',
            '</tpl>',
            '</tr>',
            '</tpl>'
        );
        var old = Ext.getCmp('htmleditor').getValue();
        Ext.getCmp('htmleditor').setValue(old +tpl.applyTemplate(tableData));
    };

    var tableform = new Ext.form.FormPanel({
        id: 'tableForm',
        xtype: "form",
        defaultType: 'numberfield',
        buttonAlign:"right",
        items: [
            {
                fieldLabel:"row",
                id:"row",
                allowNegative:false,
                allowDecimals:false,
                minvalue:0,
                maskRe:/\d/
            },{
                fieldLabel:"col",
                id:"col",
                allowNegative:false,
                allowDecimals:false,
                minvalue:0,
                maskRe:/\d/
            }
        ],
        buttons: [
            {
                xtype: "button", text: "确定", handler: function () {
                    handleTalbe();
                    tableWindow.hide();
                }
            },
            {
                xtype: "button", text: "取消", handler: function () {
                    tableform.getForm().reset();
                    tableWindow.hide();
                }
            }
        ]
    });

    var tableWindow = new Ext.Window({
        id: 'tableWindow',
        title: '插入表格',
        draggable: false,
        modal: true,
        resizable: false,
        closable:false,
        width: 400,
        height: 150,
        items: [tableform]
    });
    var progressBar = new Ext.ProgressBar({
        text: '上传中',
        width: 400
    });
    var progresswindow = new Ext.Window({
        title: "进度",
        closable: false,
        draggable: false,
        modal: true,
        resizable: false,
        items: [
            progressBar
        ]
    });
    var form = new Ext.form.FormPanel({
        id: "myform",
        defaultType: 'textfield',
        labelAlign: 'right',
        frame: true,
        width: 1200,
        items: [{
            id: "htmleditor",
            xtype: "htmleditor",
            width: 900,
            height: 600,
            fieldLabel: 'editor',
        }],
        buttons: [{
            text: 'reset',
            listeners: {
                "click": function () {
                    Ext.getCmp("myform").getForm().reset();
                }
            }
        },
            {
                text: 'submit',
                handler: function () {
                    if (Ext.isEmpty(Ext.getCmp("htmleditor").getValue())) {
                        Ext.Msg.alert("title", "内容为空")
                    } else {
                        progresswindow.show();
                        progressBar.wait({
                            duration: 3000,
                            interval: 1000,
                            increment: 3,
                            text: "正在提交数据，请稍候。。。",
                            scope: this,
                            fn: function () {
                                Ext.Msg.alert('提示', '恭喜你，提交成功');
                                progresswindow.hide();
                            }
                        });
                        // var waitbox=Ext.Msg.wait("正在提交数据，请稍候。。。","友情提示");
                        // waitbox.hide.defer(3000, waitbox);
                    }
                }
            }
        ]
    });

    var panel = new Ext.Panel({
        renderTo: "wrapPanel",
        title: "留言板",
        style: "margin:auto",
        width: 1200,
        tbar: toolbar,
        items: [form]
    });
    panel.getEl().on('contextmenu', function (e) {
        e.preventDefault();
        clickMenu.showAt(e.getXY());
    });
})
