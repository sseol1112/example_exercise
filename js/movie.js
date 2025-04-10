(function(){
    var movieJS = {
        init: function () {
            const self = this;

            self.setting();
            self.bindEvent();
            self.settingMovie();
        },
        setting: function () {
            const self = this;
            self.pageHeader = document.querySelector("header");
            self.mainContent = document.querySelector(".main");
            self.btnSelect = document.querySelector(".btn_select");
            self.btnReserve = document.querySelector(".btn_reserve");
            self.btnCancel = document.querySelector(".btn_cancel");
            self.btnClose = document.querySelectorAll(".btn_close");            
            self.btnSubmitWrap = document.querySelector(".btn_submit_wrap");
            self.seatWrap = document.querySelector(".seat_wrap");
            self.movieItemLeft = document.querySelector(".left_content");
            self.movieItemRight = document.querySelector(".right_content");
            self.movieSelectItem = document.querySelector(".movie_select_item");
            self.reserveDetailArea = document.querySelector(".reserve_detail");

            self.movieInfoList = "";
            self.movieTitle = "";
            self.movieTimes = "";
            self.movieImg = "";
            self.selectedTitle = "";
            self.selectedTimes = "";
            self.imgHtml = "";
            self.infoHtml = "";
            self.selectHtml = "";
            self.movieSeats = "";
            self.movieData = "";
            self.totalSeats = "";
            self.alertMessage = "";
            self.btnText = "";

            self.reserveMovie = "";
            self.reserveSeats = "";
            self.saveSelectedTime = "";
        },
        bindEvent: function () {
            const self = this;
            self.movieSelectItem.addEventListener("change", function () {
                self.movieItemLeft.innerHTML = "";
                self.pageHeader.querySelector(".desc").innerHTML = "";
                self.movieItemRight.style.display = "none";
                self.btnSelect.style.display = "block";
                self.btnSubmitWrap.classList.remove("active");
                self.btnReserve.classList.remove("active");
            });

            self.btnSelect.addEventListener("click", function() {
                movieJS.selectTicket();
            });

            self.btnReserve.addEventListener("click", function() {
                movieJS.reserveTicket();
            });

            self.btnSubmitWrap.querySelector(".btn_submit").addEventListener("click", function(){
                movieJS.submitTicket(this);
            });

            self.btnSubmitWrap.querySelector(".btn_confirm").addEventListener("click", function () {
                movieJS.openPopup("confirmPopup", "normal");
                movieJS.reserveDetail();
            });

            self.btnClose.forEach((closeBtn,idx) => {
                closeBtn.addEventListener("click", function (e) {
                    const target = e.target;
                    const popId = target.closest(".layer_pop").getAttribute("id");
                    movieJS.closePopup(popId);
                });
            });

            self.btnCancel.addEventListener("click", function(e) {
                const target = e.target;
                const popId = target.closest(".layer_pop").getAttribute("id");
                movieJS.cancelReservationInfo(target);
                movieJS.closePopup(popId);
            });

        },
        apiTicket: function () {
            const self = this;
            // 영화 데이터 fetch로 불러옴
            fetch("../js/movie.json")
                .then((response) => response.json())
                .then((data) => {
                    const movies = data.movies;
                    self.movieData = movies;
                });
        },
        settingMovie: function () {
            const self = this;
            movieJS.apiTicket();
            self.selectHtml += `<option value="" data-index="">상영 영화 선택</option>`;
            setTimeout(function () {
                self.movieData.forEach((movie, index) => {
                    const movieTitle = movie.title;
                    self.selectHtml += `<option value="${movieTitle}" data-index="${index}">${movieTitle}</option>`;
                });
                self.mainContent.classList.add("active");
                self.movieSelectItem.innerHTML = self.selectHtml;
            }, 500);
        },
        selectTicket: function () {
            const self = this;
            movieJS.apiTicket();
            setTimeout(() => {
                const selectedText = self.movieSelectItem.options[self.movieSelectItem.selectedIndex].innerText;
                self.selectedTitle = self.movieSelectItem.options[self.movieSelectItem.selectedIndex].value;
                self.imgHtml = "";
                self.seatWrap.innerHTML = self.imgHtml;
                if (!!self.selectedTitle) {
                    self.movieData.forEach((movie, index) => {
                        self.movieTimes = movie.showtimes;
                        self.movieImg = movie.img;
                        self.movieTitle = movie.title;
                        if (self.selectedTitle === self.movieTitle) {
                            self.imgHtml += `
                                    <div class="movie_select" data-index="${index}">
                                        <div class="movie_item">
                                            <img src="${self.movieImg}" alt="${self.movieTitle}">
                                        </div>
                                        <div class="movie_info">
                                            <section class="info">
                                                <select>
                                                    <option name="item" value="" data-index="">상영 시간 선택</option>
                                                    <option name="item" value="${self.movieTimes[0]}" data-index="${index}">${self.movieTimes[0]}</option>
                                                    <option name="item" value="${self.movieTimes[1]}" data-index="${index}">${self.movieTimes[1]}</option>
                                                    <option name="item" value="${self.movieTimes[2]}" data-index="${index}">${self.movieTimes[2]}</option>
                                                </select>
                                            </section>
                                        </div>
                                    </div>`;
                        }
                    });
                    document.querySelector(".content_box").style.display = "flex";
                    self.movieItemLeft.innerHTML = self.imgHtml;
                    self.btnSelect.style.display = "none";
                    self.btnReserve.classList.add("active");
                    self.mainContent.classList.add("active");
                } else {
                    self.alertMessage = `${selectedText}을 해주세요`;
                    movieJS.openPopup("alertPopup", "alert", self.alertMessage);
                }
            }, 500);
        },
        reserveTicket: function () {
            const self = this;
            const seat = self.seatWrap.querySelectorAll(".seat");
            movieJS.apiTicket();
            setTimeout(() => {
                self.movieInfoList = document.querySelector(".movie_info .info select");
                const selectedText = self.movieInfoList.options[self.movieInfoList.selectedIndex].innerText;
                self.selectedTimes = self.movieInfoList.options[self.movieInfoList.selectedIndex].value;
                self.selectedTitle = self.movieSelectItem.options[self.movieSelectItem.selectedIndex].value;

                self.infoHtml = "";
                self.seatWrap.innerHTML = self.infoHtml;

                if (!!self.selectedTimes) {
                    self.movieData.forEach((movie, index) => {
                        self.movieTitle = movie.title;
                        if (self.selectedTitle === self.movieTitle) {
                            self.totalSeats = movie.total_seats;
                            self.movieSeats = movie.seats;
                            for (var i = 0; i < self.totalSeats; i++) {
                                if (i < self.movieSeats) {
                                    self.infoHtml += `<div class="seat"><input type="checkbox" name="${i + 1}" class="seat_item" /><span class="" data-index="${i}">${i + 1}</span></div>`;
                                } else {
                                    self.infoHtml += `<div class="seat disabled"><input type="checkbox" name="${i + 1}" class="seat_item" disabled/><span class="" data-index="${i}">${i + 1}</span></div>`;
                                }
                            }
                        }
                    });
                    self.pageHeader.querySelector(".desc").innerHTML = `"선택된 영화:" ${self.selectedTitle}, 좌석 : ${self.movieSeats},  총좌석 : ${self.totalSeats}, 선택한 시간 : ${self.selectedTimes}`;
                    self.pageHeader.classList.add("active");
                    self.movieItemRight.style.display = "block";
                    self.seatWrap.innerHTML = self.infoHtml;
                    self.btnReserve.classList.remove("active");
                    self.btnSubmitWrap.classList.add("active");
                } else {
                    self.alertMessage = `${selectedText}을 해주세요`;
                    movieJS.openPopup("alertPopup", "alert", self.alertMessage);
                }
            }, 500);
        },
        submitTicket: function (target) {
            const self = this;
            const seat = self.seatWrap.querySelectorAll(".seat_item:checked");
            const selectedSeats = Array.from(seat).map((item) => item.name);
            const selectedMovie = self.movieSelectItem.options[self.movieSelectItem.selectedIndex].value;
            const selectedTimes = self.movieInfoList.options[self.movieInfoList.selectedIndex].value;
            self.btnText = target.innerText;
            self.alertMessage = "";
            if (selectedSeats.length === 0) {
                self.alertMessage = "좌석을 선택해주세요.";
            } else {
                self.alertMessage = `"${selectedMovie}" 영화 / 상영 시간 ${selectedTimes} / \n ${selectedSeats} 좌석이 예약되었습니다.`;
                localStorage.setItem("selectedMovie", selectedMovie);
                localStorage.setItem("selectedSeats", selectedSeats);
                localStorage.setItem("selectedTimes", selectedTimes);
            }
            movieJS.openPopup("alertPopup", "alert", self.alertMessage, self.btnText);
        },
        reserveDetail: function () {
            const self = this;
            self.reserveMovie = localStorage.getItem("selectedMovie");
            self.reserveSeats = localStorage.getItem("selectedSeats");
            self.saveSelectedTime = localStorage.getItem("selectedTimes");

            if (self.reserveMovie != null && self.reserveSeats != null && self.saveSelectedTime != null) {
                self.reserveDetailArea.innerHTML = `예약된 영화 : ${self.reserveMovie} / 상영 시간 ${self.saveSelectedTime} / 좌석 : ${self.reserveSeats} 번 입니다`;
            } else {
                self.reserveDetailArea.innerHTML = "예약하신 내역이 없습니다.";
            }
        },
        cancelReservationInfo: function (target) {
            const self = this;
            // 예약 정보가 있을경우만 취소
            self.btnText = target.innerText;
            if (self.reserveMovie != null && self.reserveSeats != null && self.saveSelectedTime != null) {
                localStorage.removeItem("selectedMovie");
                localStorage.removeItem("selectedSeats");
                localStorage.removeItem("selectedTimes");
                self.alertMessage = "예약하신 영화가 취소되었습니다.";
            } else {
                self.alertMessage = "예약하신 영화가 없습니다. \n 예약 후 진행해주세요.";
                // alert("예약하신 영화가 없습니다.");
            }
            movieJS.openPopup("alertPopup", "alert", self.alertMessage, self.btnText);
        },
        openPopup: function (popupId, type, message, title) {
            const self = this;
            const popup = document.getElementById(popupId);
            const popupTitle = popup.querySelector(".pop_header .title");
            if (popup) {
                switch (type) {
                    case "normal":
                        popup.classList.add("active");
                        popup.querySelector(".modal_layer").style.display = "block";
                        break;
                    case "alert":
                        popup.classList.add("active");
                        popup.querySelector(".modal_layer").style.display = "block";
                        popup.querySelector(".pop_body .desc").style.textAlign = "center";

                        if (title) {
                            popupTitle.innerText = title;
                        } else {
                            popupTitle.innerText = "🔔 alert !";
                        }
                        popup.querySelector(".pop_body .desc").innerText = message;
                        break;
                }
                movieJS.trapFocus(popup);
            } else {
                alert(`❌ error ! ${popupId}의 id값을 확인해주세요.`);
            }
        },
        closePopup : function(popupId) {
            const self = this;
            const popup = document.getElementById(popupId);

            if (popup) {
                popup.classList.remove("active");
                popup.querySelector(".modal_layer").style.display = "none";
            }
        },
        trapFocus : function(modal) {
            const self = this;
            const focusableElements = modal.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            modal.focus();
            modal.addEventListener("keydown", function (event) {
                if (event.key === "Tab") {
                    if (event.shiftKey) {
                        // Shift + Tab
                        if (document.activeElement === firstElement) {
                            event.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        // Tab
                        if (document.activeElement === lastElement) {
                            event.preventDefault();
                            firstElement.focus();
                        }
                    }
                }

                if (event.key === "Escape") {
                    movieJS.closePopup();
                }
            });
        }
    };
    window.onload = function() {
        movieJS.init();
    }
    
    // document.addEventListener("DOMContentLoaded", function(){
    //     movieJS.init();
    // });
    
}())


