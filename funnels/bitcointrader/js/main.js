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
            }, 1000);
        }, 4000);
    });

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
}());
console.log('Socketing!');
