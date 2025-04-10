(function() {	
    var commonJS = {
        init: function () {
            var self = this;

            self.setting();
            self.bindEvent();
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
            commonJS.bindEvtModal();
            commonJS.openPopup();
        },
        bindEvtModal: function () {
            const self = this; 

            if(self.btnOpen!= null) {
                self.btnOpen.addEventListener("click", function () {                
                    self.dialog.showModal(); // showModal로 열면 모달형식의 팝업 노출, show()로하면 비모달형식의 팝업 노출				
                });
            }

            if(self.btnClose!= null) {
                self.btnClose.addEventListener("click", function () {
                    self.dialog.close();
                });
            }

            if(self.typeName!= null) {
                self.typeName.addEventListener("keydown", function (evt) {
                    switch (evt.code) {
                        case "Enter":
                            evt.preventDefault();
                            self.dialog.querySelector(".default").click();
                            break;
                    }
                });
            }

            if(self.dialog!= null) {
                self.dialog.addEventListener("close", function () {
                    switch (self.dialog.returnValue) {
                        case "cancel":
                            return false;
                        case "negative":
                            self.message.innerHTML = "당신이 가능할때 언제든지 저에게 말씀해 주세요.";
                            break;
                        case "postive":
                            self.dialog.returnValue = self.typeName.value;
                            if (self.dialog.returnValue) {
                                self.message.innerHTML = `<p class='username'>안녕하세요, ${self.dialog.returnValue}님 :)</p>`;
                            } else {
                                self.message.innerHTML = "당신은 이름을 가지고 있지 않나요? 만약 그게 아니라면, 당신의 이름을 저에게 말해주기를 원하지 않나요?";
                            }
                            break;
                    }
                });
            }
        },
        openPopup : function (popupId) {                        
            const popup = document.getElementById(popupId);
            if (popup) {
                popup.style.display = "block";
            }

        },
        closePopup : function (popupId) {
            const popup = document.getElementById(popupId);

            if (popup) {
                popup.classList.remove("active");
                popup.querySelector(".modal_layer").style.display = "none";
            }

            console.log(popupId);

        }
        
    };

	commonJS.init();

}());