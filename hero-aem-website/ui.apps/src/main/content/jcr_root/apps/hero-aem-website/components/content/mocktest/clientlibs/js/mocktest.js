$(document).ready(function () {
  if ($(".mocktest").length > 0) {
    var randomQuestionArr = [];
    var timeoutFunc;
    function customValidationMockTest($form) {
      //for email
      jQuery.validator.addMethod("emailOnly", function (value) {
        return /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i.test(value);
      });
      // mock test form
      $form.validate({
        ignore: [],
        rules: {
          name: {
            required: true,
          },
          email: {
            required: true,
            emailOnly: true,
          },
        },
        messages: {
          name: {
            required: $('[name="mockTestFullName"]').data("validation-msg-req"),
          },
          email: {
            required: $('[name="mockTestEmail"]').data("validation-msg-req"),
            emailOnly: $('[name="mockTestEmail"]').data(
              "validation-msg-format"
            ),
          },
        },
      });
    }
    if ($("#mockTestCredential").length > 0) {
      customValidationMockTest($("#mockTestCredential"));
    }

    $("#mockTestCredentialSubmit").on("click", function () {
      let currentForm = $(this).closest("form");

      //Data to API
      let mockTestFullName = $("#mockTestCredential #mockTestFullName").val();
      let mockTestEmail = $("#mockTestCredential #mockTestEmail").val();

      var mocktestFormData = {
        mockTestFullName: mockTestFullName,
        mockTestEmail: mockTestEmail
      };

      var mocktestRelativePath = $("#mocktestregister").attr(
        "data-component-relativePath"
      );

      var mocktestFormPath = mocktestRelativePath.replace(
        "jcr:content",
        "_jcr_content"
      );
      
      $.ajax({
        url: mocktestFormPath,
        type: "POST",
        data: JSON.stringify(mocktestFormData),
        dataType: "json",
        contentType: "application/json",
        success: function (resp) {
          let jsonResp = resp;
          if (typeof jsonResp != "object") {
            jsonResp = JSON.parse(resp);
          }
        },
        error: function (error) { },
      });

      if (currentForm.valid()) {
        alert("You have 15 minutes to complete test!");
        $(this).closest(".content--wrap").addClass("d-none");
        $("#mockTestContainer").removeClass("d-none");
        let jsonData = $("#mockTestCredential").data("mock-test-json");
        let arr = [];
        if (jsonData.length)
          while (arr.length < 15) {
            var r = Math.floor(Math.random() * (jsonData.length - 1 + 1)) + 1;
            if (arr.indexOf(r) === -1) arr.push(r);
          }
        randomQuestionArr =
          jsonData &&
          jsonData.filter((element) => {
            return arr.some((childArr) => {
              return childArr === element.id;
            });
          });
        let ques = $("#mockTest .mocktestQuestions");
        ques.html("");
        randomQuestionArr &&
          randomQuestionArr.forEach((ele, index) => {
            let elements = "";
            elements = `<div class="form-wrap-mocktest">
        <div class="d-flex mb-3">
        <h4 class="mocktest-questions mb-3">
            ${++index}) ${ele.question} 
        </h4>
        ${
          ele.Question_image_Path &&
          `<img src="${ele.Question_image_Path}" alt="" width="auto" height="100px" class="pl-4"/>`
        }
        </div>
        <div class="row">
            <div class="col-6 anwsers mb-2">
                <input type="radio" name="${
                  ele.id
                }" value="option_1" class="mt-1">
                <span class="pl-1">${ele.option_1}</span>
            </div>
            <div class="col-6 anwsers  mb-2">
                <input type="radio" name="${
                  ele.id
                }" value="option_2" class="mt-1">
                <span class="pl-1">${ele.option_2}</span>
            </div>
            <div class="col-6 anwsers  mb-2">
                <input type="radio" name="${
                  ele.id
                }" value="option_3" class="mt-1">
                <span class="pl-1">${ele.option_3}</span>
            </div>
            <div class="col-6 anwsers  mb-2">
                <input type="radio" name="${
                  ele.id
                }" value="option_4" class="mt-1">
                <span class="pl-1">${ele.option_4}</span>
            </div>
            <div class="correct-answer" data-value="${
              ele.correct_answer
            }"></div>
        </div>
        </div>`;
            ques.append(elements);
          });
        timeoutFunc = setTimeout(mocktestTimeout, 900000);
      }
    });
    function mocktestTimeout() {
      alert("Time is up, your result is being processed.");
      $("#mockTestSubmit").trigger("click");
    }

    $("#mockTestSubmit").on("click", function () {
      clearTimeout(timeoutFunc);
      let $inputs = $(".mocktestQuestions :radio:checked");
      let data = [];
      let count = 0;
      $inputs &&
        $inputs.each(function () {
          let iscorrect =
            $(this).val() ===
            $(this).closest(".row").find(".correct-answer").data("value");
          iscorrect && count++;
          let correctAnswer = {
            id: $(this).attr("name"),
            answer: $(this).val(),
            correct_answer: $(this)
              .closest(".row")
              .find(".correct-answer")
              .data("value"),
            iscorrect: iscorrect,
          };
          data.push(correctAnswer);
        });
      console.log(data, "data");
      let thankyouMsg = $("#mocktest-thankyou");
      $("#mockTestContainer").addClass("d-none");
      thankyouMsg &&
        $("html, body").animate(
          {
            scrollTop: thankyouMsg.offset().top - 166,
          },
          "slow"
        );
      thankyouMsg.removeClass("d-none");
      let resultJson = [];
      randomQuestionArr &&
        randomQuestionArr.forEach((ele) => {
          data &&
            data.forEach((child) => {
              if (child.id == ele.id) {
                let correct_ans = ele.correct_answer;
                let submitted_ans = child.answer;
                let jsonData = {
                  id: ele.id,
                  question: ele.question,
                  correctAnswer: ele[correct_ans],
                  answer: ele[submitted_ans],
                  iscorrect: child.iscorrect,
                };
                resultJson.push(jsonData);
              }
            });
        });
      console.log(resultJson);
      let report =
        resultJson.length > 0
          ? `<div class="my-2"> Attempted Question:- ${resultJson.length}</div>
    <div class="mb-2">Submitted Answer:- ${resultJson.length}</div>
    <div class="mb-3">Correct Answers:- ${count}</div>`
          : `<div class="my-2"> You have not attempted any questions. Please try again.</div>`;
      $("#mocktest-results").append(report);
      if (resultJson.length == 0) {
        $("#mocktest-thankyou .h3-bold-heading-std").addClass("d-none");
      }

      $(".mocktest .mock-test-heading").addClass("d-none");
      $(".mocktest .success-heading").removeClass("d-none");
      resultJson &&
        resultJson.forEach((ele, index) => {
          let element = "";
          element = `<div class="form-wrap-mocktest">
            <div class="d-flex">
                <h4 class="mocktest-questions mb-3">
                    ${++index}) ${ele.question}
                </h4>
            </div>
            <div class="row">
                ${
                  !ele.iscorrect
                    ? `<div class="col-12 anwsers mb-2">
                    <span class="ans-label"> Correct answer : &nbsp;</span>
                    <span class="correctanswer ans-label">${ele.correctAnswer}</span>
                </div>
                <div class="col-12 results  mb-2">
                    <span class="ans-label"> Submitted answer : </span>
                    <span class="wronganswer ans-label">${ele.answer}</span>
                </div>`
                    : ` <div class="col-12 results  mb-2">
                    <span class="ans-label"> Submitted answer : </span>
                    <span class="correctanswer ans-label">${ele.correctAnswer}</span>
                </div>`
                }
            </div>
        </div>`;
          $("#mocktest-results-percentage").append(element);
        });
    });
  }
});
