/// <reference path="ArmTemplate.ts" />
/// <reference path="Resource.ts" />
/// <reference path="ResourceShape.ts" />
/// <reference path="ToolboxResource.ts" />
/// <reference path="../../../typings/tsd.d.ts" />
var Graph = (function () {
    function Graph(template, toolboxItems) {
        this.resourceShapes = new Array();
        this.template = template;
        this.toolboxItems = toolboxItems;
        this.initJointJs();
        this.createNodes();
        this.createLinks();
        this.initializeClickPopup();
    }
    Graph.prototype.initJointJs = function () {
        this.graph = new joint.dia.Graph();
        this.paper = new joint.dia.Paper({ el: $('#paper'), gridSize: 1, model: this.graph, height: '100%', width: '100%' });
    };
    Graph.prototype.createNodes = function () {
        var _this = this;
        this.template.resources.forEach(function (resource) {
            var toolboxItem = _this.getToolboxItemForResource(resource);
            var shape = new ResourceShape(resource, toolboxItem);
            _this.addShape(shape);
            _this.resourceShapes.push(shape);
        });
    };
    Graph.prototype.createLinks = function () {
        var self = this;
        this.template.resources.forEach(function (resource) {
            var dependencies = self.template.getDependencies(resource);
            dependencies.forEach(function (dep) {
                var sourceNode = self.getShapeForResource(resource);
                var destNode = self.getShapeForResource(dep);
                var l = new joint.dia.Link({
                    source: { id: sourceNode.id },
                    target: { id: destNode.id },
                    attrs: {
                        '.connection': { 'stroke-width': 5, stroke: '#34495E' },
                        '.marker-target': { fill: 'yellow', d: 'M 10 0 L 0 5 L 10 10 z' }
                    }
                });
                self.graph.addCell(l);
            });
        });
    };
    Graph.prototype.addShape = function (shape) {
        shape.position(80, 80);
        shape.resize(170, 100);
        shape.attributes.rect = { fill: '#E67E22', stroke: '#D35400', 'stroke-width': 5 };
        this.graph.addCell(shape);
    };
    Graph.prototype.getToolboxItemForResource = function (resource) {
        var foundItem = null;
        this.toolboxItems.forEach(function (toolboxItem) {
            if (toolboxItem.resourceType === resource.type) {
                foundItem = toolboxItem;
            }
        });
        return foundItem;
    };
    Graph.prototype.getShapeForResource = function (resource) {
        var retShape;
        this.resourceShapes.forEach(function (shape) {
            if (shape.sourceResource === resource) {
                retShape = shape;
            }
        });
        return retShape;
    };
    Graph.prototype.initializeClickPopup = function () {
        var self = this;
        this.paper.on('cell:pointerdown', function (evt, x, y) {
            var shape = evt.model;
            self.displayResource(shape.sourceResource);
        });
    };
    Graph.prototype.displayResource = function (resource) {
        $('#nodeProperties').val(JSON.stringify(resource, null, 2));
    };
    return Graph;
})();
//# sourceMappingURL=graph.js.map