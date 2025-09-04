var randomTextGenerator = (function () {
  var getRandomChar = function () {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return chars[Math.floor(Math.random() * chars.length)];
  };

  var resetShuffleText = function (element) {
    // If the element is currently shuffling, cancel the animation
    if (element.hasAttribute('data-shuffle')) {
      // Restore the original content
      var originalContent = element.getAttribute('data-original-content');
      cancelAnimationFrame(element.getAttribute('data-shuffle'));
      element.removeAttribute('data-shuffle');
      if (originalContent) {
        setTimeout(() => {
          element.textContent = originalContent;
        }, 100);
      }
    }
  };

  var shuffleText = function (element, textSpeed) {
    // Define the sets of letters for shuffling
    var uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';

    // Animation settings
    var speed = textSpeed; // Speed of shuffling animation
    var increment = 2; // Number of characters to shuffle per frame

    if (element.hasAttribute('data-shuffle')) {
      // If an animation is running, cancel it and revert to the original content
      cancelAnimationFrame(element.getAttribute('data-shuffle'));
      element.removeAttribute('data-shuffle');
      var originalContent = element.getAttribute('data-original-content');
      if (originalContent) {
        setTimeout(() => {
          element.textContent = originalContent;
          shuffleText(element);
        }, 100);
      }
    } else {
      // Start the animation
      element.setAttribute('data-shuffle', 'true');

      // Store the original content as a data attribute if it hasn't been stored yet
      if (!element.hasAttribute('data-original-content')) {
        element.setAttribute(
          'data-original-content',
          element.textContent.trim()
        );
      }

      var originalText = element.getAttribute('data-original-content');
      var textLength = originalText.length;
      var shuffleIndex = 0;
      var shuffleStartIndex = 1;
      var shuffledBlock = '';
      var fixedPart = originalText.charAt(0);

      var updateElement = function (timestamp) {
        var deltaTime = timestamp - lastTime;

        if (deltaTime > speed) {
          for (var i = 0; i < textLength - shuffleStartIndex; i++) {
            var num;
            var letter;
            if (
              originalText[shuffleStartIndex + i] === ' ' ||
              originalText[shuffleStartIndex + i] === "'"
            ) {
              // If the character is a space or apostrophe, don't shuffle it
              shuffledBlock = shuffledBlock + ' ';
            } else {
              var currentLetter =
                originalText[shuffleStartIndex + i].toLowerCase(); // Convert current letter to lowercase

              if (currentLetter === originalText[shuffleStartIndex + i]) {
                // If the character is lowercase, shuffle the lowercase set
                num = Math.floor(lowercaseLetters.length * Math.random());
                letter = lowercaseLetters.charAt(num);
              } else {
                // Otherwise, shuffle the uppercase set
                num = Math.floor(uppercaseLetters.length * Math.random());
                letter = uppercaseLetters.charAt(num);
              }
              shuffledBlock = shuffledBlock + letter;
            }
          }
          if (shuffleIndex === increment - 1) {
            shuffleStartIndex++;
          }
          if (shuffleIndex === increment) {
            fixedPart = fixedPart + originalText.charAt(shuffleStartIndex - 1);
            shuffleIndex = 0;
          }
          element.textContent = fixedPart + shuffledBlock;
          shuffledBlock = '';
          shuffleIndex++;
          lastTime = timestamp;
        }

        if (element.hasAttribute('data-shuffle')) {
          requestAnimationFrame(updateElement);
        }
      };

      var lastTime = 0;
      requestAnimationFrame(updateElement);
    }
  };

  var setDataAttribute = function (ele) {
    if (!$(ele).data('original-text')) {
      $(ele).attr('data-original-text', ele.innerText);
    }
  };

  var setRandomText = function (element, originalText, count) {
    let newText = '';
    for (i = 0; i < originalText.length; i++) {
      if (i === count) {
        newText += getRandomChar();
      } else {
        newText += originalText[i];
      }
    }
    element.innerText = newText;
  };

  var getText = function (ele) {
    return $(ele).data('original-text');
  };

  var fromStart = function (element) {
    setDataAttribute(element);
    let originalText = getText(element);
    let count = 0;
    let interval = setInterval(function () {
      setRandomText(element, originalText, count);
      count++;
      if (count === originalText.length) {
        element.innerText = originalText;
      }
      if (count > originalText.length) {
        clearInterval(interval);
      }
    }, 120);
  };

  var fromEnd = function (element) {
    setDataAttribute(element);
    let originalText = getText(element);
    let count = originalText.length - 1;
    let interval = setInterval(function () {
      setRandomText(element, originalText, count);
      count--;
      if (count < 0) {
        clearInterval(interval);
        element.innerText = originalText;
      }
    }, 120);
  };

  // Public API
  return {
    fromStart: fromStart,
    fromEnd: fromEnd,
    shuffleText: shuffleText,
    resetShuffleText: resetShuffleText,
  };
})();
