var randomTextGenerator = (function () {
  var getRandomChar = function () {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return chars[Math.floor(Math.random() * chars.length)];
  };

  var resetShuffleText = function (element) {
    // If the element is currently shuffling, cancel the animation
    if (element.hasAttribute('data-shuffling')) {
      cancelAnimationFrame(element.getAttribute('data-shuffling'));

      // Restore the original content
      var originalContent = element.getAttribute('data-original-content');
      if (originalContent) {
        element.textContent = originalContent;
      }
      element.removeAttribute('data-shuffling');
    }
  };

  var shuffleText = function (element, textSpeed = 10) {
    var uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    var speed = textSpeed; // Speed of shuffling animation
    var increment = 5; // Number of characters to shuffle per frame

    if (element.hasAttribute('data-shuffling')) {
      // Animation is already running, stop it
      cancelAnimationFrame(element.getAttribute('data-shuffling'));
      element.removeAttribute('data-shuffling');

      // Revert to the original content
      var originalContent = element.getAttribute('data-original-content');
      if (originalContent) {
        element.textContent = originalContent;
      }
    } else {
      // Start the animation
      element.setAttribute('data-shuffling', 'true');

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
        if (!lastTime) lastTime = timestamp;
        var deltaTime = timestamp - lastTime;

        if (deltaTime >= speed) {
          for (
            var i = 0;
            i < textLength - shuffleStartIndex && i < increment;
            i++
          ) {
            var currentLetter = originalText[shuffleStartIndex + i];
            if (currentLetter === ' ' || currentLetter === "'") {
              // If the character is a space or apostrophe, don't shuffle it
              shuffledBlock += currentLetter;
            } else {
              // Shuffle the letter based on its case
              var isLowercase = currentLetter === currentLetter.toLowerCase();
              var letters = isLowercase ? lowercaseLetters : uppercaseLetters;
              var num = Math.floor(letters.length * Math.random());
              var letter = letters.charAt(num);
              shuffledBlock += letter;
            }
          }

          if (shuffleIndex === increment - 1) {
            shuffleStartIndex++;
          }

          if (shuffleIndex === increment) {
            fixedPart += originalText.charAt(shuffleStartIndex - 1);
            shuffleIndex = 0;
          }

          element.textContent = fixedPart + shuffledBlock;
          shuffledBlock = '';
          shuffleIndex++;
          lastTime = timestamp;
        }

        if (shuffleStartIndex < textLength) {
          requestAnimationFrame(updateElement);
        } else {
          element.removeAttribute('data-shuffling');
        }
      };

      var lastTime;
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
