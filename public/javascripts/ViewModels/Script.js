var grid;
    var crudServiceBaseUrl = "../_vti_bin/listdata.svc/",
     kendo = window.kendo,
     App = window.App = {
           columMap : {
               'Tasks' : [
                   { title : "Title", field : "Title" },
                   { title : "Created", field : "Created" },
                   { title : "Created By", field : "CreatedBy.Account" }
               ],
               'Contacts' : [
                   { title : "Last Name", field : "LastName" },
                   { title : "Created", field : "Created" },
                   { title : "Created By", field : "CreatedBy.Account" }
               ]
           },
           Model : {
               gridMeta : kendo.observable({
                   listName : 'Contacts',
                   total : 0
               })
           }
       };
 
 
   App.DS = {
       sharableDataSource : new kendo.data.DataSource({
           type : "SP2010",
           serverPaging : true,
           serverSorting : true,
           serverFiltering : true,
           sort : [
               { field : "Created", dir : "desc" }
           ],
           pageSize : 40,
           transport : {
               read : {
                   url : function () {
                       return crudServiceBaseUrl + App.Model.gridMeta.get('listName')
                   },
                   dataType : "json"
               }
           },
           change : function (e) {
               App.Model.gridMeta.set('total', this.total() || 0);
           }
       })
   };
 
 
   App.createGrid = function(options) {
       var options = options || {};
       $('#grid').kendoGrid({
                  dataSource : App.DS.sharableDataSource,
                  autoBind : options.autobind || false,
                  height : 400,
                  sortable : true,
                  navigatable : true,
                  selectable : 'row',
                  scrollable : {
                      virtual : true
                  },
                  columns : App.columMap[App.Model.gridMeta.get('listName')] || []
              });
   };
// Currently KendoUI grid doesn't support column modifying of an existent grid
   App.refreshGrid = function (listName) {
       var CHANGE = 'change',
           $grid = $('#grid');
 
       App.Model.gridMeta.set('listName', listName);
 
       // Unbind existing refreshHandler in order to re-create with different column set
       if ($grid.length > 0 && $grid.data().kendoGrid) {
           var thisKendoGrid = $grid.data().kendoGrid;
 
           if (thisKendoGrid.dataSource && thisKendoGrid._refreshHandler) {
               thisKendoGrid.dataSource.unbind(CHANGE, thisKendoGrid._refreshHandler);
               $grid.removeData('kendoGrid');
               $grid.empty();
           }
       }
 
       App.createGrid({autobind : true});
   };
