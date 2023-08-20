var app = angular.module("ngMap");

app.controller("navbar", [
  "$scope",
  "$http",
  function ($scope, $http) {
    $http
      .get("/getCustomerInformation")
      .success(function (response) {
        if (response.status == 200) {
          $scope.firstName = response.data.firstName;
          $scope.email = response.data.email;
        } else {
          //window.location.assign('/logout');
        }
      })
      .error(function (error) {
        window.location.assign("/errorCustomer");
      });
  },
]);

app.controller("billings", function ($scope, $http) {
  $scope.ratingForm = false;

  $scope.goBack = true;

  $scope.init = function (bill) {
    //alert(bill);

    $http({
      method: "GET",
      url: "/getBill",
      params: {
        billId: bill,
      },
    })
      .success(function (response) {
        // alert('inside');

        $scope.billingId = response.billingId;
        $scope.rideId = response.rideId;
        $scope.rideDate = response.rideDate;
        $scope.pickUpLocation = response.pickUpLocation;
        $scope.dropOffLocation = response.dropOffLocation;
        $scope.rideStartTime = response.rideStartTime;
        $scope.rideEndTime = response.rideEndTime;
        $scope.rideDistance = response.rideDistance;
        $scope.customerId = response.customerId;
        $scope.driverId = response.driverId;
        $scope.rideAmount = response.rideAmount;
      })
      .error(function () {
        alert("error");
      });
  };

  $scope.rating = function (rate) {
    $scope.driverRating = rate;
  };

  $scope.submit = function () {
    $http({
      method: "POST",
      url: "/rateDriver",
      data: {
        rideId: $scope.rideId,
        driverId: $scope.driverId,
        rating: $scope.driverRating,
        reviews: $scope.driverReview,
      },
    })
      .success(function (response) {
        $scope.ratingForm = true;
        $scope.goBack = false;
      })
      .error(function (error) {});
  };
});
