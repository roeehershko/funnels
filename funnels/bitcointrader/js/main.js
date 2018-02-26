(function () {
    Number.prototype.formatMoney = function(c, d, t){
        var n = this,
            c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
            j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };

    // Select all links with hashes
    $('a[href*="#"]')
    // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function(event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000, function() {
                        // Callback after animation
                        // Must change focus!
                        var $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        } else {
                            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
                            $target.focus(); // Set focus again
                        };
                    });
                }
            }
        });

    let socket = io('//46.101.146.71:4000');
    let notifyHTML = $('#notify-template').html();
    let animations = [ 'pulse', 'flash', 'shake' ];

    setTimeout(function () {
        socket.on('profit', function (profit) {
            let profitHTML = notifyHTML;
            profitHTML = profitHTML.replace('{{ name }}', profit.name);
            profitHTML = profitHTML.replace('{{ profit }}', profit.amount.formatMoney(0));
            let $profitEl = $(profitHTML);
            let animation = animations[Math.floor(Math.random() * animations.length)];
            $profitEl.addClass('animated ' + animation);

            $('.notify-container').append($profitEl);

            setTimeout(function () {
                $profitEl.removeClass(animation).addClass('zoomOut');
                setTimeout(function () {
                    $profitEl.remove();
                }, 500);
            }, 4000);
        });
    }, 6000);

    socket.on('rates', function(rates){
      for(coin in rates) {
        let rate = rates[coin];
        let $el = $('.bitcoin h2[data-asset=' + coin + ']');
        let currentRate = parseFloat($el.find('.rate').prop('data-rate'));

        if (currentRate) {
            if (currentRate > rate) {
                $el.removeClass('red green');
                $el.addClass('red');
            }
            else if (currentRate < rate) {
                $el.removeClass('red green');
                $el.addClass('green');
            }
        }
        else {
          $el.addClass('green');
        }

        if (currentRate !== rate) {
            $el.find('.rate').addClass('flash');
            setTimeout(function () {
                $el.find('.rate').removeClass('flash')
            }, 1000);
        }

        $el.find('.rate').text(rate.formatMoney(3));
        $el.find('.rate').prop('data-rate', rate);
      }
    });

    $(function () {
        $('#phone_number').intlTelInput({
            initialCountry: 'GB',
            preferredCountries: ['GB'],
            separateDialCode: true
        });
        $('#step1-form').validator({ focus: false, disable: false });
        $('#step2-form').validator({ focus: false, disable: false });

        // Forms
        $('#step1-form').on('submit', function (e) {
            if ( ! e.isDefaultPrevented()) {
                e.preventDefault();
                // Add tag to tracking client - Password Form

                $(this).find('.progress').removeClass('hidden');
                $(this).find('button').prop('disabled', 'disabled');

                let progress = 20;
                let interval = setInterval(function () {
                    if (progress >= 100) {
                        setTimeout(function () {
                            $('.step1').addClass('animated fadeOut');
                            setTimeout(function () {
                                $('.step2').removeClass('hidden').addClass('animated fadeIn');
                                $('.step1').addClass('hidden');
                            }, 500);
                        }, 500);

                        clearInterval(interval);
                    }
                    else {
                        let plus = Math.random() * 20;
                        if (plus < 3) plus = 0;

                        progress = progress + Math.round(plus);
                        progress = progress > 100 ? 100 : progress;

                        $('#step1-form')
                            .find('.progress .progress-bar')
                            .css('width', progress + '%')
                            .find('.progress-text .complete').text(progress + '%');
                    }

                }, 500);
            }
        });

        $('.step2 form').on('submit', function (e) {
            if ( ! e.isDefaultPrevented()) {
                e.preventDefault();
                // Add tag to tracking client - Password Form
                $('.step2').addClass('animate fadeOut');
                setTimeout(function () {
                    $('.step2').addClass('hidden');
                    $('.step3').removeClass('hidden');
                }, 400)
            }
        });

        $('.step3 form').on('submit', function (e) {
            if ( ! e.isDefaultPrevented()) {
                e.preventDefault();
                $(this).find('#finish-btn').addClass('hidden');
                $(this).find('.progress').removeClass('hidden');

                let progress = 20;
                let interval = setInterval(function () {
                    if (progress >= 100) {
                        clearInterval(interval);
                    }
                    else {
                        let plus = Math.random() * 20;
                        if (plus < 3) plus = 0;

                        progress = progress + Math.round(plus);
                        progress = progress > 100 ? 100 : progress;

                        $('.step3 form .progress .progress-bar')
                            .css('width', progress + '%')
                            .find('.progress-text .complete').text(progress + '%');
                    }

                }, 500);

                $.ajax({
                    url: 'http://api.cryptoguard.co/leads',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        first_name: $('input[name=name]').val().split(' ')[0] || '',
                        last_name: $('input[name=name]').val().split(' ')[1] || '',
                        email: $('input[name=email]').val(),
                        phone: $("#phone").intlTelInput("getSelectedCountryData").dialCode + $('input[name=phone]').val(),
                        country: 'gb',
                        password: $('input[name=password]').val()

                    }),
                    dataType: 'json',
                    success: function (res, status) {
                        if (res.status === 1) {
                            progress = 90;
                            setTimeout(function () {
                                location.href = res.loginUrl;
                            }, 1000);
                        }
                    }
                })
            }
        })

    });
}());
console.log('Socketing!');
