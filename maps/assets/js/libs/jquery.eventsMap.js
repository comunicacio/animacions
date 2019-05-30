/*
 * EventsMap  v1.0
 */

(function($) {

	function EventsMap(element, options) {
		this.root = $(element);

		var self = this;

		this.settings = $.extend({}, $.fn.eventsMap.defaults, options);

		this.settings.isModalOpen = false;

		//console.log(this.settings);
		this.root.append('<div id="map"></div>');
		this.root.append('<div id="map-modal"></div>');

    this.root.find('#map').css({
      backgroundColor : this.settings.backgroundColor
    });

		this.init();
	}

	EventsMap.prototype = {

		itemCounter : 0,

		init : function() {

			var self = this;

      //init TopoJSON
      L.TopoJSON = L.GeoJSON.extend({
          addData: function (data) {
              var geojson, key;
              if (data.type === "Topology") {
                  for (key in data.objects) {
                      if (data.objects.hasOwnProperty(key)) {
                          geojson = topojson.feature(data, data.objects[key]);
                          L.GeoJSON.prototype.addData.call(this, geojson);
                      }
                  }

                  return this;
              }

              L.GeoJSON.prototype.addData.call(this, data);

              return this;
          }
      });

      L.topoJson = function (data, options) {
          return new L.TopoJSON(data, options);
      };

      this.initMap();
      this.loadData();

		},


    initMap : function() {
      this.map = L.map('map',  {
        minZoom: 2,
        maxZoom: 4
    }).setView([51.505, -0.09], 2);

      /*
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      */

			this.map.scrollWheelZoom.disable();

			/*
			this.map.on('click', function(e){
				console.log(e.latlng);
			});
			*/

			var self = this;
			$(document).on('click','.country-link',function(event){
				event.preventDefault();

				var link = $(event.target).closest('.country-link');
				self.selectCountry(link.data('code'));
			})

			$(document).on('click','.map-modal-close-btn',
				$.proxy(this.closeModal,this)
			);

    },

		loadData : function() {

			var self = this;

			$.getJSON('assets/data/data.json').done(function(data) {

				//console.log("Data => ",data);

				self.settings.markers = data.markers;
				self.settings.countries = data.countries;
				self.settings.platforms = data.platforms;
				self.settings.articles = data.articles;
				self.settings.projects = data.projects;
				self.settings.texts = data.texts;

				self.settings.selectedCountries = [];
				for(var key in self.settings.projects) {
					var project = self.settings.projects[key];

					$.merge(
						self.settings.selectedCountries,
						project.countries
					);
				}

				var mergedCountries = {};
				for(var key in self.settings.selectedCountries){
					mergedCountries[self.settings.selectedCountries[key]] = 1;
				}
				self.settings.selectedCountries = [];
				for(var key in mergedCountries){
					self.settings.selectedCountries.push(key);
				}


				self.addMarkers();
				self.loadCountries();
				self.renderLegend();

				var countries = "[";
				for(var key in self.settings.countries){
					countries += "\""+key+"\",";
				}
				countries += "]";
				//console.log("countries => ",countries);

			});

		},

		i18n : function(key) {
			if(this.settings.texts[key][this.settings.locale] !== undefined)
				return this.settings.texts[key][this.settings.locale];
			else
				console.error("key : "+key+" doesn't exist.");
		},

    existInSelected: function(countryId) {

        for (var key in this.settings.selectedCountries) {
            var country = this.settings.selectedCountries[key];

            if (country == countryId) {
                return true;
            }
        }
        return false;

    },

    createDefinition: function() {

				var self = this;

        return new L.TopoJSON(null, {
            style: function(feature) {
                return feature.properties.layerStyle;
            },
            onEachFeature: function(feature, layer) {
                // does this feature have a property named popupContent?

								//console.log("feature => ",feature.properties.brk_a3);

								if(self.existInSelected(feature.properties.brk_a3)){
									layer.bindTooltip(
										self.settings.countries[feature.properties.brk_a3][self.settings.locale], {
											sticky: true,
											direction : 'top'
									});

									layer.on('click', function() {
											//TODO on click
											self.selectCountry(layer.feature.properties.brk_a3)
									});
									layer.on('mouseover', function () {
										this.setStyle(self.settings.hoverStyle);
									});
									layer.on('mouseout', function () {
										//console.log("mouseout => ",this.feature.properties.brk_a3,self.settings.selectedCountry);
										if(this.feature.properties.brk_a3 == self.settings.selectedCountry){
											this.setStyle(self.settings.hoverStyle);
										}else {
											this.setStyle(self.settings.selectedStyle);
										}
									});

								}
            }
        });
    },

		selectCountry : function(countryCode) {
			//console.log("Seleccion pais : "+countryCode);
			this.settings.selectedCountry = countryCode;

			this.updateData();
			this.renderModal();
			this.openModal();
		},

    loadCountries : function() {

      var self = this;

        $.getJSON('assets/data/countries.topojson')
            .done(function(data) {
							self.geoJSONdata = data;
							self.definition = self.createDefinition();
							self.definition.addData(self.geoJSONdata);
							self.map.addLayer(self.definition);
							self.updateData();
            });

    },

		updateData : function(avoidZoom) {

			var self = this;

			//console.log("Map :: Generate Topojson data => ",self.geoJSONdata);

			var selectedLayers = [];
			var clickedLayer = null;

			self.definition.eachLayer(function(layer) {

					//console.log("Map :: eachLayer => ",layer);

					if (self.existInSelected(layer.feature.properties.brk_a3)) {
							//app.debug(layer);

							if(self.settings.selectedCountry == layer.feature.properties.brk_a3){
								layer.setStyle(self.settings.hoverStyle);
								clickedLayer = layer;
							}
							else {
								layer.setStyle(self.settings.selectedStyle);
							}

							selectedLayers.push(layer);
					}
					else {
							layer.setStyle(self.settings.defaultStyle);
					}
			});

			if(avoidZoom !== undefined && avoidZoom){
				return;
			}

			if(clickedLayer != null){
				var padding = [360,20]
				if($(window).width() < 500){
					padding = [20,20];
				}
	      //self.map.panBy(positionOnScreen);
	      self.map.fitBounds(clickedLayer.getBounds(),{
	        paddingBottomRight : padding
	      });
			}
			else {
				var group = L.featureGroup(selectedLayers);

				var padding = [20, 20];

				self.map.fitBounds(group.getBounds(), {
						padding: padding
				});
			}
		},

		addMarkers : function() {

			var markers = L.markerClusterGroup({
				showCoverageOnHover : false,
				maxClusterRadius : this.settings.maxClusterRadius
			});

			//articles
			var icon1 = L.icon({
			    iconUrl: 'assets/img/icon-1@2x.png',
					//shadowUrl: 'leaf-shadow.png',
					iconSize:     [30, 30], // size of the icon
			    //shadowSize:   [50, 64], // size of the shadow
			    iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
			    //shadowAnchor: [4, 62],  // the same for the shadow
			    popupAnchor:  [0, -15] // point from which the popup should open relative to the iconAnchor
			});

			//platforms
			var icon2 = L.icon({
			    iconUrl: 'assets/img/icon-2@2x.png',
			    //shadowUrl: 'leaf-shadow.png',
					iconSize:     [30, 30], // size of the icon
			    //shadowSize:   [50, 64], // size of the shadow
			    iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
			    //shadowAnchor: [4, 62],  // the same for the shadow
			    popupAnchor:  [0, -15] // point from which the popup should open relative to the iconAnchor
			});

			//render articles
			for (var i = 0; i < this.settings.articles.length; i++) {
				var markerData = this.settings.articles[i];

				//console.log(markerData);

				var marker = L.marker(markerData.latlng, {
					icon : icon1
				});

				var customPopup = '<div class="custom-popup-article">'+
					'<div class="tooltip-image" style="background-image:url(\''+markerData.image+'\')">'+
					'</div>'+
					'<div class="content">'+
						'<p class="title">'+markerData.title+'</p>'+
					'</div>'+
				"</div>";

		    // specify popup options
		    var customOptions =
        {
        'maxWidth': '300',
        'className' : 'custom-popup-article'
        }

				marker.bindPopup(customPopup,customOptions);
				markers.addLayer(marker);
			}

			//render platforms
			for (var i = 0; i < this.settings.platforms.length; i++) {
				var markerData = this.settings.platforms[i];

				//console.log(markerData);

				var marker = L.marker(markerData.latlng, {
					icon : icon2
				});

				var locale = this.settings.locale;

				// create popup contents
    		var customPopup = '<div class="custom-popup">'+
					'<div class="tooltip-image" style="background-image:url(\''+markerData.image+'\')">'+
					'</div>'+
					'<div class="content">'+
						'<p class="title">'+this.settings.countries[markerData.country][locale]+'</p>'+
						'<p class="subtitle">'+markerData.subtitle[locale]+'</p>'+
						'<span class="decoration"></span>'+
						'<a href="'+markerData.url[locale]+'" target="_blank">'+this.i18n('read_more')+'</a>'+
					'</div>'+
				"</div>";

		    // specify popup options
		    var customOptions =
        {
        'maxWidth': '360',
        'className' : 'plaftorm-popup'
        }

				marker.bindPopup(customPopup,customOptions);
				markers.addLayer(marker);
			}

			this.map.addLayer(markers);

		},


		renderCountries : function(countries) {
			var result = "";
			var locale = this.settings.locale;

			for(var key in countries) {
				var country = countries[key];
				//console.log(country);
				result += (key > 0 ? ', ': '')+
					'<a href="" data-code="'+country+'" class="country-link">'+this.settings.countries[country][locale]+'</a>';
			}
			return result;
		},

		renderModalItems : function(projects) {

			const {webroot,locale} = this.settings;

			var result = '<div class="list-title">'+
					'<p class="map-modal-subtitle">'+
						'<span>'+projects.length+'</span> '+this.i18n('projects_legend')+
					'</p>'+
				'</div>'+
				'<ul>';

			for(var key in projects){
				var project = projects[key];
				result += '<li>'+
					'<div class="map-modal-item">'+
						'<div class="map-image" style="background-image:url(\''+project.image+'\')"></div>'+
						'<div class="map-content">'+
							'<p class="map-item-title">'+project.title+'</p>'+
							'<p class="map-item-text">'+this.i18n('date_end')+' '+project.date+'</p>'+
							'<p class="map-item-text">'+
								this.renderCountries(project.countries)+
							'</p>'+
							'<span class="decoration"></span>'+
							'<a href="'+webroot+locale+project.url+'" target="_blank" class="read-more">'+this.i18n('read_more')+'</a>'+
						'</div>'+
					'</div>'+
				'</li>';
			}

			result += '</ul>';

			return result;
		},

		renderPlatform : function(plaftorm) {

			var locale = this.settings.locale;

			var result = '<div class="list-title">'+
					'<p class="map-modal-subtitle">'+
						'<span>1</span> '+this.i18n('plaftorms_title')+
					'</p>'+
				'</div>'+
				'<ul>';

			result += '<li>'+
					'<div class="map-modal-item">'+
						'<div class="map-image" style="background-image:url(\''+plaftorm.image+'\')"></div>'+
						'<div class="map-content">'+
							'<p class="map-item-title">'+this.settings.countries[plaftorm.country][locale]+'</p>'+
							'<p class="map-item-text">'+this.i18n('platforms_legend')+'</p>'+
							'<p class="map-item-text">'+
								plaftorm.subtitle[locale]+
							'</p>'+
							'<span class="decoration"></span>'+
							'<a href="'+plaftorm.url[locale]+'" target="_blank" class="read-more">'+this.i18n('read_more')+'</a>'+
						'</div>'+
					'</div>'+
				'</li>';

			result += '</ul>';

			return result;

		},

		renderModal : function() {
			var selectedCountry = this.settings.selectedCountry;
			var locale = this.settings.locale;

			if(selectedCountry != null){
				var projects = [];
				for(var key in this.settings.projects ){
					var project = this.settings.projects[key];

					if(project.countries.indexOf(selectedCountry) != -1){
						//if project has country
						projects.push(project);
					}
				}

				var plaftorm = null;
				for(var key in this.settings.platforms){
					var currentPlatform = this.settings.platforms[key];
					if(currentPlatform.country == selectedCountry){
						plaftorm = currentPlatform;
						break;
					}
				}


				var modal = '<div class="map-modal-header">'+
	          '<p class="map-modal-title">'+
	            this.settings.countries[selectedCountry][locale]+
	          '</p>'+
	          '<div class="map-modal-button">'+
	            '<a href="" class="map-modal-close-btn">x</a>'+
	          '</div>'+
	        '</div>'+
	        '<div class="map-modal-body">'+
						(plaftorm != null ? this.renderPlatform(plaftorm) : '')+
	          '<ul>'+
							this.renderModalItems(projects)+
	          '</ul>'+
	        '</div>';

				$('#map-modal').html(modal);
			}

		},

		openModal : function() {

				if(!this.settings.isModalOpen){
	        this.settings.isModalOpen = true;

	        $("#map-modal").css({
	            display:"block",
	            //zIndex:5,
	            opacity:1,
	            right:-600
	        });

	        TweenMax.to($("#map-modal"),1,{
	            delay : 0.15,
	            ease: Power2.easeInOut,
	            right: 0
	        });

	      }

		},

		closeModal : function(e) {

			e.preventDefault();

			if(this.settings.isModalOpen){

	        this.settings.isModalOpen = false;
					this.settings.selectedCountry = null;
	        var self = this;



	        TweenMax.to($("#map-modal"),0.5,{right: -600,ease: Power2.easeInOut,onComplete :function(){
	              $("#map-modal").css({
	                  opacity:0,
	                  display:'none',
	                  //zIndex:0
	              });
								self.updateData(true);
	          }});

	      }

		},

		renderLegend : function() {

			var legend = '<div id="map-legend">'+
        '<ul>'+
          '<li>'+
            '<div class="icon">'+
              '<div class="square orange" ></div>'+
            '</div>'+
            '<div class="numbers">'+
              //'<span>'+this.settings.selectedCountries.length+'</span>'+
							this.i18n('projects_legend')+
            '</div>'+
						/*
            '<div class="text">'+
              this.i18n('projects_legend')+
            '</div>'+
						*/
          '</li>'+
          '<li>'+
            '<div class="icon">'+
              '<img src="assets/img/icon-2.png" />'+
            '</div>'+
            '<div class="numbers">'+
              //'<span>'+this.settings.platforms.length+'</span>'+
							this.i18n('platforms_legend')+
            '</div>'+
						/*
            '<div class="text">'+
              this.i18n('platforms_legend')+
            '</div>'+
						*/
          '</li>'+
          '<li>'+
            '<div class="icon">'+
              '<img src="assets/img/icon-1.png" />'+
            '</div>'+
            '<div class="numbers">'+
              //'<span>'+this.settings.articles.length+'</span> '+
							this.i18n('articles_legend')+
            '</div>'+
						/*
            '<div class="text">'+
              this.i18n('articles_legend')+
            '</div>'+
						*/
          '</li>'+
        '</ul>'+
      '</div>';

			this.root.append(legend);
			$("#map-modal").css({
				'height' : 'calc(100% - '+$("#map-legend").height()+'px)'
			});
			$("#map-modal .map-modal-body").css({
				'height' : 'calc(100vh - 75px - '+$("#map-legend").height()+'px)'
			});

		},

    render : function() {

    }

	}; /* EventsMap.prototype end */

	$.fn.eventsMap = function(options) {
		return this.each(function(){
			var eventsMap = new EventsMap($(this), options);
			$(this).data("eventsMap", eventsMap);
		});
	};

	$.fn.eventsMap.defaults = {
		//define defaults
		webroot:'https://www.isglobal.org/',
		locale : 'ca',
		defaultStyle : {
      color : '#fff',
      fillColor : '#d4cecb',
      opacity : 1,
      fillOpacity : 1,
      weight : 0.5
    },
    selectedStyle : {
      color : '#fff',
      fillColor : '#f39130',
      opacity : 1,
      fillOpacity : 1,
      weight : 0.5
    },
		hoverStyle : {
      color : '#fff',
      fillColor : '#c56200',
      opacity : 1,
      fillOpacity : 1,
      weight : 0.5
    },
		backgroundColor : '#f5f5f5',
    hoverColor : '#e47100',
		maxClusterRadius : 20,
		selectedCountry : null
	};

	$.fn.eventsMap.settings = {};

})(jQuery);
