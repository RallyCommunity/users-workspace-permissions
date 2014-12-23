Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        Ext.create('Rally.data.wsapi.Store', {
            //model: 'UserPermission' ,   //Abstract type causes: Uncaught Rally.data.ModelFactory.getModel(): Could not find registered factory for type:  userpermission
            model: 'WorkspacePermission',
            limit: Infinity,
            fetch:['User','Role','Name', 'Workspace','UserName','SubscriptionAdmin'],
            autoLoad: true,
            listeners: {
                load: function(store, data, success){
                     this._onDataLoaded(store,data);
                } ,
                scope: this
            }
        });
    },
    _onDataLoaded:function(store,results) {
        var permissions = _.reduce(results, function(finalResult, permissionRecord){
            finalResult[permissionRecord.get('User').UserName] = (finalResult[permissionRecord.get('User').UserName] || []).concat(permissionRecord.get('Workspace')._refObjectName);
            return finalResult;
        },{}) ;
        this._show(permissions);
    },
    _show:function(permissions)  {
        var arrayOfPermissions = [];
        _.each(permissions, function(value,key){
            arrayOfPermissions.push({'user':key,'workspaces':value});
        });

        this.add({
            xtype: 'rallygrid',
            showPagingToolbar: true,
            showRowActionsColumn: false,
            editable: false,
            store: Ext.create('Rally.data.custom.Store', {
                data: arrayOfPermissions
            }),
            columnCfgs: [
                {
                    text: 'User',dataIndex: 'user',minWidth:200
                },
                {
                    text: 'Workspaces',dataIndex: 'workspaces',minWidth:200, renderer: function(workspaces){
                        var text = [];
                        _.each(workspaces, function(workspace){
                             text.push(workspace);
                        });
                        return text.join('<br />');
                    }
                }
            ]
        });
    }
});
