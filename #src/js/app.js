@@include('libs/jquery.maskedinput.min.js', {})

// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"

"use strict";
function DynamicAdapt(type) {
	this.type = type;
}
DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};
DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};
// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}
// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}
// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();

(function burgerMenu() {
	const burger = document.querySelector(".header-burger");
	const menu = document.querySelector(".header-top__menu");
	const overlay = document.querySelector(".overlay");
	const body = document.querySelector("body");

	const showMenu = () => {
		burger.classList.add('_active')
		menu.classList.add('_show')
		body.classList.add('_lock')
		overlay.classList.add('_active')
	}

	const closeMenu = () => {
		burger.classList.remove('_active')
		menu.classList.remove('_show')
		body.classList.remove('_lock')
		overlay.classList.remove('_active')
	}

	if (burger) {
		burger.addEventListener("click", () => {
			if (!menu.classList.contains('_show')) {
				showMenu()
			} else {
				closeMenu()
			}
		})
	}
	document.addEventListener('click', (e) => {
		if (burger && !e.target.closest(".header-burger, .header-top__menu")) {
			closeMenu()
		}
	})
})()

$('.slider-advertising-banners__body').slick({
	infinite: true,
	slidesToShow: 5,
	slidesToScroll: 1,
	// autoplay: true,
	// autoplaySpeed: 3000,
	dots: false,
	responsive: [
		{
			breakpoint: 1350,
			settings: {
				arrows: false,
				dots: true
			}
		},
		{
			breakpoint: 1250,
			settings: {
				slidesToShow: 4,
				arrows: false,
				dots: true
			}
		},
		{
			breakpoint: 1000,
			settings: {
				slidesToShow: 3,
				arrows: false,
				dots: true
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 2,
				arrows: false,
				dots: true
			}
		},
		{
			breakpoint: 565,
			settings: {
				slidesToShow: 1,
				arrows: false,
				dots: true
			}
		},
	]
});

// =============  adaptive img   ==========================================================
function ibg() {
	let ibg = document.querySelectorAll("._ibg");
	for (var i = 0; i < ibg.length; i++) {
		if (ibg[i].querySelector('img') && ibg[i].querySelector('img').getAttribute('src') != null) {
			ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
		}
	}
}
ibg();


// ============  tab to accordion  ========================================================
$(".requisites__tab-accordion").click(function () {
	if ($(this).hasClass("d_active")) {
		var d_activeTab = $(this).attr("rel");
		$("#" + d_activeTab).removeClass("active show");
		$(this).removeClass("d_active");
	} else {
		$(".tab-pane").removeClass("active show");
		$(".requisites__tab-accordion").removeClass("d_active");
		var d_activeTab = $(this).attr("rel");
		$("#" + d_activeTab).addClass("active show");
		$(this).addClass("d_active");
	}
});

// ==================   Change src banner   =============================================
const imgBanner = document.querySelector(".banner__img")
if (imgBanner) {
	if($(window).width() < 565) {
		imgBanner.src = "./img/link-banner-mobile.jpg"
	} else {
		imgBanner.src = "./img/link-banner.jpg"
	}
}

// ===========  Label transform on input focus ===========================
$('input,textarea').val("");
$('.form-checking input').focusout(function() {
	var text_val = $(this).val();
	if (text_val === "") {
		$(this).removeClass('has-value');
	} else {
		$(this).addClass('has-value');
	}
});

// ===========  Input mask ===========================
$(document).ready(function(){
	$('#uniqueId').mask('999999999999999999999999');
	$('#checkoutNumber').mask('999999999');
	$('#paymentDocumentNumber').mask('9999999999');
});


// ===========  Modal checking ===========================
const showModal = ( type, srcImg = '') => {
	let modalImg = document.querySelector('.modal-checking__img img');
	let modalInfo = document.querySelector('.modal-checking__info');

	switch (type) {
		case 'info':
			modalImg.src = `${srcImg}`;
			modalInfo.innerHTML = '';
			break;

		case 'error':
			modalImg.src = './img/error.svg';
			modalInfo.innerHTML = `<div class="modal-checking__title">Произошла ошибка<br> при проверке чека!</div>
																				<div class="modal-checking__text">Чек не найден в системе контроля кассового оборудования</div>`;
		break;

		case 'success':
			modalImg.src = './img/success.svg';
			modalInfo.innerHTML = `<div class="modal-checking__title">Проверка чека<br> прошла успешно!</div>
																				<div class="modal-checking__text">Чек найден в системе контроля кассового оборудования</div>`;
			break;
	}

	$("#modalChecking").modal("show");
}

particlesJS("particles-js", 
{"particles":
{"number":
{"value":5,"density":
{"enable":true,"value_area":800}},
"color":{"value":"#f9b974"},
"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":3},"image":{"src":"img/github.svg","width":100,"height":100}},"opacity":{"value":1,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":118.37214624484089,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":false,"distance":150,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":1,"direction":"none","random":true,"straight":false,"out_mode":"bounce","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":false,"mode":"repulse"},"onclick":{"enable":false,"mode":"push"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});var count_particles, update; stats.setMode(0); stats.domElement.style.position = 'absolute'; stats.domElement.style.left = '0px'; stats.domElement.style.top = '0px'; document.body.appendChild(stats.domElement); count_particles = document.querySelector('.js-count-particles'); update = function() { stats.begin(); stats.end(); if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) { count_particles.innerText = window.pJSDom[0].pJS.particles.array.length; } requestAnimationFrame(update); }; requestAnimationFrame(update);;