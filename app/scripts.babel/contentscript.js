'use strict';

var bug_list = [];
var board_sections = [];
var board_sections_assignee = [];

function make_bug_item(id
                       ,product
                       ,component
                       ,assignee
                       ,status
                       ,res
                       ,desc
                       ,changed
                       ,product_color)
{
  this.id = id;
  this.product = product;
  this.component = component;
  this.assignee = assignee;
  this.status = status;
  this.res = res;
  this.desc = desc;
  this.changed = changed;
  this.product_color = product_color;
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
    $scope.board_sections = board_sections;
    $scope.board_sections_assignee = board_sections_assignee;
  });

  // 2 arrays for products and their corresponding colors
  var product_names = [];
  var product_colors = [];

  // Loop through bugs list bz_buglist
  $(".bz_buglist").find(".bz_bugitem").each(function() {
    console.log(this);
    var b_id =        $(this).first().find("a").first().text().trim();
    var b_product =   $(this).find(".bz_product_column").first().text().trim();
    var b_component = $(this).find(".bz_component_column").first().text().trim();
    var b_assignee =  $(this).find(".bz_assigned_to_column").first().text().trim();
    var b_status =    $(this).find(".bz_bug_status_column").first().text().trim();
    var b_res =       $(this).find(".bz_resolution_column").first().text().trim();
    var b_desc =      $(this).find(".bz_short_desc_column").first().text().trim();
    var b_changed =   $(this).find(".bz_changeddate_column").first().text().trim();

    // start determining a product's color
    var b_product_color = "blue"; 
    if(product_names.indexOf(b_product) == -1) {
      product_names.push(b_product);
      while(true) {
        var random_color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
        if(product_colors.indexOf(random_color) == -1) {
          b_product_color = random_color;
          product_colors.push(b_product_color);
          break;
        }
      }
    } else {
      b_product_color = product_colors[product_names.indexOf(b_product)];
    }
    b_product_color = String(b_product_color);
    // end determining a product's color

    var bug_item = new make_bug_item(
      b_id
      ,b_product
      ,b_component
      ,b_assignee
      ,b_status
      ,b_res
      ,b_desc
      ,b_changed
      ,b_product_color
    );
    console.log(bug_item);

    bug_list.push(bug_item);

    if(board_sections.indexOf(b_status)  == -1) {
      board_sections.push(b_status);
    }
    if(board_sections_assignee.indexOf(b_assignee)  == -1) {
      board_sections_assignee.push(b_assignee);
    }
  });
  console.log("Number of bugs: " + bug_list.length);
  console.log(board_sections);
  console.log(bug_list);

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


