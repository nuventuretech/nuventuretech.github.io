var timesheetApp = angular.module('timesheetApp', [])
    .run(function($rootScope) {
        var iStart = -3,
            iEnd = 3,
            iExclude = [-1, 0],
            loopDate,
            i,
            StartDate,
            EndDate;
        $rootScope.loopDateCache = [];
        $rootScope.curDate = moment(window.g_bs_curDate).utc();

        $rootScope.totalHours = 0;
        $rootScope.staffs = window.staffs;
        $rootScope.shifts = window.shifts;
        if ($rootScope.curDate.weekday() >= 4) {
            iStart = 4;
            iEnd = 10;
            iExclude = [6, 7];
        }
        $rootScope.StartDate = moment(window.g_bs_curDate).weekday(iStart)
        $rootScope.EndDate = moment(window.g_bs_curDate).weekday(iEnd)
        for (i = iStart; i <= iEnd; i++) {
            if (!_.contains(iExclude, i)) {
                loopDate = moment($rootScope.curDate).weekday(i);
                $rootScope.loopDateCache.push(loopDate);
            }
        }
    })
    .filter('range', function() {
        return function(input, total) {
            total = parseInt(total);
            for (var i = 0; i < total; i++)
                input.push(i);
            return input;
        };
    });

timesheetApp.controller('GridCtrl', function($scope, $rootScope) {
    $scope.centreData = window.centres;
    $scope.centreOnChange = function(){
        console.log('handler to filter data based on centre selection');
        console.log($scope.selectedCentre);
    }
});

timesheetApp.controller('StaffCtrl', function($scope, $rootScope) {
    $scope.centres = window.centres
    var templist;
    $scope.totalStaffHours = 0;
    $scope.staffWithShifts = _.filter($rootScope.staffs, function(staff) {
        return _.find($rootScope.shifts, function(shift) {
            return shift.staff_id === staff.id;
        });
    });
    $scope.staffShiftMatrix = {};

    for (staff in $scope.staffWithShifts) {
        templist = []
        for (i in _.range(5)) {
            templist[i] = _.find($scope.shifts, function(shift) {
                return shift.staff_id === $scope.staffWithShifts[staff].id && shift.day === $rootScope.loopDateCache[i].format('YYYY-MM-DD');
            });
        }
        $scope.staffShiftMatrix[$scope.staffWithShifts[staff].id] = templist;
    }
    $scope.clickToAddTime = function(staff_id, type, date){
        $scope.selected_staff_id = staff_id
        $scope.selected_date = date
    }
    $scope.isThisCellSelected=function(staff_id, date){
        return $scope.selected_staff_id===staff_id && $scope.selected_date===date ;
    }
    window.tempstore = $scope.staffShiftMatrix;
});

$(document).ready(function(){
    $("#mySel").select2({
        // more select2 options
    });
});
