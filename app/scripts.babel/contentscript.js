'use strict';

var bug_list = [];
var board_sections = [];

function make_bug_item(id, sect, title, desc, assignee, component) {
  this.id = id;
  this.sect = sect;
  this.title = title;
  this.desc = desc;
  this.assignee = assignee;
  this.component = component;

  return this;
}

window.addEventListener("load", function() {
  var app = angular.module('bzb', []);

  var html = document.querySelector('html');
  html.setAttribute('ng-app', '');
  html.setAttribute('ng-csp', '');
  
  var viewport = document.getElementById('bugzilla-body');  
  viewport.setAttribute('ng-controller', 'MainController');
  app.controller('MainController', function ($scope) {
    $scope.bug_list = bug_list;
  });

  // Loop through bugs list bz_buglist
  $(".bz_buglist").find(".bz_bugitem").each(function() {
    console.log(this);
    var b_id = $(this).first().find("a").first().text();
    var b_status = $(this).find(".bz_bug_status_column").first().text();
    var b_title = $(this).find(".bz_short_desc_column").first().text();
    var b_assignee = $(this).find(".bz_assigned_to_column").first().text();
    var b_component = $(this).find(".bz_component_column").first().text();
    console.log(b_id + " " + b_status + " " + b_title);

    var bug_item = new make_bug_item(
      b_id,
      b_status,
      b_title,
      '',
      b_assignee,
      b_component
    );

    bug_list.push(bug_item);

    if($.inArray(b_status, board_sections) >= 0) {
      board_sections.push(b_status);
    }
  });
  console.log("Number of bugs: " + bug_list.length);
  console.log(board_sections);

  var board = document.createElement('div');
  board.setAttribute('board', '');
  viewport.prepend(board);
  
  app.directive('board', ['$sce', function($sce) {
    return {
      restrict: 'EA', 
      replace: true,
      templateUrl: $sce.trustAsResourceUrl(chrome.extension.getURL('templates/board.html'))
    };
  }]);

  angular.bootstrap(html, ['bzb'], []);
});