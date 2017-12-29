/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


app.factory('practiceService',function($uibModal){
    return {
      confirmModal : function($scope){
          var modalInstance = $uibModal.open({
            backdrop:true,
            windowClass: 'ModalServices',
            templateUrl: 'modalTemplate.html',
            controller: 'modalController',
            size: 'md',
            resolve: {
                itemObj: function () {
                    return '';
                }
            }
        });

        modalInstance.result.then(function (item) {
            $scope.selectedItem = item;
            //return item;
        }, function () {
            console.log("Modal Closed at " + new Date());
        });
      }  
    };
}).controller('modalController', function($scope, $uibModalInstance){
    $scope.msg = "This is just for Testing -- MSG";
    $scope.helpText = "This is just for Testing -- Help Text";
    
    $scope.confirmModal = function(){
      $uibModalInstance.close(true);  
    };
    
    $scope.declineModal = function(){
      $uibModalInstance.close(false);  
    };
});