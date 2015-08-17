/// <reference path="ToolboxResource.ts" />
/// <reference path="graph.ts" />
/// <reference path="sampleARM.ts" />
/// <reference path="ToolboxItems.ts" />
/// <reference path="../../../typings/angularjs/angular.d.ts" />

angular.module('vis')
  .controller('MainCtrl', function ($scope, $modal) {
          
    $scope.toolboxItems = toolboxItems;
    
    let templateData = <ArmTemplateInterface>arm;
    let template = new ArmTemplate(templateData);
    $scope.template = template;
    
    var graph = new Graph(toolboxItems);
    graph.applyTemplate(template);
    $scope.graph = graph;
    
    graph.resourceSelected = function(resource:Resource, modal:boolean) {
      if(modal) {        
        var modalInstance = $modal.open({
          templateUrl: '/app/resourceEditorDialog/ResourceEditor.html',
          controller: 'ResourceEditorController',
          
          //These items get passed to the chiid controller
          resolve: {
            arm: function() {
              return <ArmTemplate>$scope.template;
            },
            resource: function () {
              return resource;
            }
          }
        });
        modalInstance.result.then(function(resultResource:any) {
          if(resultResource && resultResource.deleteFlag) {
            let template= <ArmTemplate>$scope.template;
            
            template.deleteResource(<Resource>resultResource);
            graph.removeResourceShape(<Resource>resultResource);
          }
        });
      } else {
        $scope.selectedResource = JSON.stringify(resource, null, 2);
        $scope.$apply();
      }
    }
    
    $scope.downloadArmTemplate = function() {
      let armTemplate = <ArmTemplate>$scope.template;
      let json = armTemplate.toJson();
      
      downloadJsonInBrowser(json, 'armTemplate.json');
    }
    
    $scope.openExistingTemplate = function() {
      var modalInstance = $modal.open({
        templateUrl: '/app/openExistingTemplateDialog/OpenDialog.html',
        controller: 'OpenDialog.controller'
      });
            
      modalInstance.result.then(function(newTemplate:ArmTemplate) {
        $scope.template = newTemplate;
        var graph = <Graph>$scope.graph;
        graph.applyTemplate(new ArmTemplate(newTemplate));
        $scope.graph = graph;
      });
    };
    
    $scope.loadArmQuickstartTemplate = function() {
      var modalInstance = $modal.open({
        templateUrl: '/app/quickstartLoadDialog/QuickstartLoadDialog.html',
        controller: 'QuickstartLoadDialog'
      });
            
      modalInstance.result.then(function(newTemplate:ArmTemplate) {
        $scope.template = newTemplate;
        var graph = <Graph>$scope.graph;
        graph.applyTemplate(new ArmTemplate(newTemplate));
        $scope.graph = graph;
      });
    };
    
    $scope.openTemplateProperties = function() {
      //Documentation: http://angular-ui.github.io/bootstrap/#/modal
      var modalInstance = $modal.open({
      templateUrl: '/app/templateParameterEditor/TemplateProperties.html',
      controller: 'TemplatePropertiesCtrl',
      size: 'lg',
      
      //These items get passed to the chiid controller
      resolve: {
        armTemplate: function () {
          return $scope.template;
        }
      }
      });
    };
    
    $scope.toolboxItemClick = function(toolboxItem:ToolboxResource) {
      var graph = <Graph>$scope.graph;
      var resource = new Resource();
      var shape = new ResourceShape(resource, toolboxItem);
      
      graph.addNewShape(shape);
    }
  
    function downloadJsonInBrowser(json:string, fileName:string) {  
      //Crazy code to download the resulting JSON file
      //http://bgrins.github.io/devtools-snippets/#console-save
      var blob = new Blob([json], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')
      
        //A typescript guru could probably figure out how to get rid of these errors
      
        a.download = 'armTemplate.json';
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':');
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    }
  });