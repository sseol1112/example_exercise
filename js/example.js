(function(){
	
	var exampleJS = {
        init: function () {
            window.onload = function () {
                exampleJS.setting();
                exampleJS.bindEvent();
            };
        },
        setting: function () {
            var self = this;
            self.btnOpen = document.querySelector("#btnOpen");
            self.btnClose = document.querySelector("#btnClose");
            self.btnAnswerNegative = document.querySelector("#negative");
            self.btnAnswerPostive = document.querySelector("#postive");
            self.typeName = document.querySelector("#typeName");
            self.dialog = document.querySelector("dialog#myDialog");
            self.message = document.querySelector("#message");
        },
        bindEvent: function () {
            exampleJS.bindEvtModal();
        },
        bindEvtModal: function () {
            var self = this; 

            self.btnOpen.addEventListener("click", function () {                
                self.dialog.showModal(); // showModal로 열면 모달형식의 팝업 노출, show()로하면 비모달형식의 팝업 노출				
            });

            self.btnClose.addEventListener("click", function () {
                self.dialog.close();
            });

            self.typeName.addEventListener("keydown", function (evt) {				
                switch (evt.code) {
                    case "Enter":						
                        evt.preventDefault();
                        self.dialog.querySelector(".default").click();
                        break;
                }
            });

            self.dialog.addEventListener("close", function () {
                switch (self.dialog.returnValue) {
                    case "cancel":
                        return false;
                    case "negative":
                        self.message.innerHTML = "Come again anytime if you're possible.";
                        break;
                    case "postive":
                        self.dialog.returnValue = self.typeName.value;
                        if (self.dialog.returnValue) {
                            self.message.innerHTML = `<p class='username'>Hello, ${self.dialog.returnValue} :)</p>`;
                        } else {
                            self.message.innerHTML = "Are you really have no name? If you are not, you don't want to tell me your name?";
                        }
                        break;
                }
            });
        },
    };

	exampleJS.init();

}());