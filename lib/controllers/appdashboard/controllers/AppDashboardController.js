(function() {
    'use strict';
}());

angular.module('agSADCeFarms')
    .controller('AppBaseController',function($scope) {
        $scope.toggleCollapse = false;
    });

angular.module('agSADCeFarms')
        .controller('AppDashboardController', ['$scope', '$state', '$log', 'applicationService', '$sce', '$http', '$window', function($scope, $state, $log, applicationService, $sce, $http, $window) {

        $log.debug("From Parent Controller:", $scope.$parent.dashboard_state);
        var checkID = applicationService.checkAppID($state.params.ID);

        if (checkID) {
            applicationService.fetchApplication($state.params.ID).then(
                    function(response) {
                        //console.log(response);
                        $scope.appForm = response.questionnaire_json.question_sections;
                        $scope.appIntro = $sce.trustAsHtml(response.questionnaire_json.questionaire_introduction);
                        $scope.appTitle = $sce.trustAsHtml(response.questionnaire_json.questionaire_title);
                        $scope.appID = $state.params.ID;
                    },
                    function(errResponse) {
                        console.error('Error while fetching Currencies');
                    }
            );


            $scope.formData = {};
            $scope.SectionClass = 'sectionDisabled';

            $scope.showHelpInfo = function(e) {
                $(e.target).closest('.queSectionInfo').find('.showOnClick').toggle('show');
                setTimeout(function() {
                    $(e.target).closest('.queSectionInfo').find('.showOnClick').hide();
                }, 5000);
            };

            $scope.addRow = function(ques, rowData) {
                var questionDetails = $('#quesId-' + ques.question_id);
                var questionIndex = questionDetails.attr('data-questionIndex');
                var sectionIndex = questionDetails.attr('data-sectionIndex');
                $scope.appForm[sectionIndex].questions[questionIndex].input.data.push(rowData[0]);
            };

             $scope.deleteRow = function(ques, tblId) {
            var questionDetails = $('#quesId-' + ques.question_id);
            var questionIndex = questionDetails.attr('data-questionIndex');
            var sectionIndex = questionDetails.attr('data-sectionIndex');
            var questionGUID = $scope.appForm[sectionIndex].questions[questionIndex].question_guid;
            var sectionGUID = $scope.appForm[sectionIndex].question_section_guid;
            var questionID = $scope.appForm[sectionIndex].questions[questionIndex].question_id;

            for (var i = $('#' + tblId + ' tr.selected').length -1; i >= 0; i--) {
                var rowIndex = $('#' + tblId + ' tr.selected').eq(i).find('.tblRowIndex').val();
                $scope.formData[sectionGUID][questionGUID][questionID].input.splice(rowIndex, 1);
                $scope.appForm[sectionIndex].questions[questionIndex].input.data.splice(rowIndex, 1);
            }

            $('#' + tblId + ' tr').removeClass('selected');
        };

            $scope.checkValid = function(e) {
                var fieldId = e.target.attributes.id.value;
                var maxLength = e.target.attributes.maxlength.value;

                if (fieldId == 'phone' || fieldId == 'zip' || fieldId == 'fax') {
                    var targetVal = $('#' + fieldId).val();
                    $('#' + fieldId).val(targetVal.replace(/[^0-9]/g, ''));

                    var valLength = $('#' + fieldId).val().length;
                    if (valLength < maxLength) {
                        $('#' + fieldId).addClass('failedCheck inputError ');
                    } else {
                        $('#' + fieldId).removeClass('failedCheck').removeClass('inputError ');
                    }
                } else if (fieldId == 'email') {
                    var checkMatch = $('#' + fieldId).val().match(/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/);
                    if (!checkMatch) {
                        $('#' + fieldId).addClass('failedCheck inputError ');
                    } else {
                        $('#' + fieldId).removeClass('failedCheck').removeClass('inputError ');
                    }
                }
            };

            $scope.submitForm = function(e) {
                var error = false;
                $.each($('div[sectionGUID="' + e + '"]').find('.questionFields.required-true input[type="text"], .questionFields.required-true textarea'), function(index, value) {
                    var classes = $(this).attr('class').split(' ');
                    if (classes.indexOf('ng-empty') > 0 || classes.indexOf('ng-untouched') > 0 || classes.indexOf('failedCheck') > 0) {
                        $(this).closest('.form-group').addClass('has-error');
                        $(this).addClass('inputError');
                        error = false;
                    } else {
                        $(this).closest('.form-group').removeClass('has-error');
                        $(this).removeClass('inputError');
                        error = true;
                    }
                });
                $.each($('div[sectionGUID="' + e + '"]').find('.questionFields.required-true input[type="radio"]'), function(index, value) {
                    var classes = $(this).attr('class').split(' ');
                    if (classes.indexOf('ng-empty') > 0 || classes.indexOf('ng-invalid') > 0 || classes.indexOf(' ng-invalid-required') > 0) {
                        $(this).closest('.form-group').addClass('has-error');
                        $(this).addClass('inputError');
                        error = false;
                    } else {
                        $(this).closest('.form-group').removeClass('has-error');
                        $(this).removeClass('inputError');
                        error = true;
                    }
                });
                if (error) {
                    /*$('div[sectionGUID="' + e + '"]').closest('.panel.panel-default').next().find('.panel-heading').removeClass('sectionDisabled');

                     */
                    try {
                        var postBody = [];
                        $.each($scope.formData[e], function(index, value) {
                            answerJSON = {};
                            $.each(value, function(queIndex, queValue) {
                                $.each(queValue, function(ansIndex, ansValue) {
                                    if (angular.isArray(ansValue)) {
                                        $.each(ansValue, function(key, objVal) {
                                            answerJSON[key] = objVal;
                                        });
                                    } else {
                                        answerJSON[ansIndex] = ansValue;
                                    }
                                });
                            });
                            jSONObj = {
                                "question_guid": index,
                                "answer_json": answerJSON
                            };
                            postBody.push(jSONObj);
                        });


                        postBody = {
                            'application_id': $scope.appID,
                            'questions': postBody
                        };

                        $('div[sectionGUID="' + e + '"]').closest('.panel.panel-default').find('.panel-heading').addClass('sectionDisabled');
                        $('div[sectionGUID="' + e + '"]').closest('.panel.panel-default').next().find('.panel-collapse').addClass('in');
                        $('div[sectionGUID="' + e + '"]').removeClass('in');
                        $window.scrollTo(0, $('div[sectionGUID="' + e + '"]').position('top'));
                    } catch (e) {
                        console.log('Error While submitting FormData');
                    }

                    applicationService.submitApplication(postBody).then(
                            function(response) {
                                console.log(response);
                                $scope.submitRes = response;
                            },
                            function(errResponse) {
                                console.error('Error while fetching Currencies');
                            }
                    );
                    //console.log(e, $scope.formData[e],postBody);
                } else {
                    $window.scrollTo(0, $('div[sectionGUID="' + e + '"]').position('top'));
                    $('.appIntro').append("<span id='formErrorMsg' class='alert alert-danger'>Please fill all Mandatory(*) Fields</span>");
                    setTimeout(function() {
                        $('#formErrorMsg').remove();
                    }, 2000);
                    toastr.error('Please fill all Mandatory Fields');
                    console.log('Please fill all Mandatory Fields');
                }
            };
        } else {
            $scope.IDfailed = true;
        }
    }]);
