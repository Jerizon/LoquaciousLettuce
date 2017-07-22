var visuals = {
  0: (upperX, UpperY, lowerX, lowerY, frequencyData, ctx, bufferLength)=>{
    //console.log(frequencyData);
    var barWidth = (lowerX / bufferLength);
    var barHeight;
    var x = upperX;
    var heightModifier = 2;
    for (var i = 0; i < bufferLength; i++) {
      barHeight = frequencyData[i];
      ctx.fillStyle = 'rgb(' + (barHeight + 100) + ', 50, 255)';
      ctx.fillRect(x, 600 - heightModifier * barHeight, barWidth, heightModifier * barHeight);
      x += barWidth;
    }
  },
  1: (upperX, upperY, lowerX, lowerY, frequencyData, ctx, bufferLength)=>{
    var twoPi = 2 * Math.PI;
    var objectsCount = 128;
    var radius = 20;
    
    var change = twoPi / objectsCount;
    var amount = 0;
    for (var i = 0; i < twoPi; i += change) {
      var barHeight = frequencyData[amount];
      var x = radius * Math.cos(i);
      var y = radius * Math.sin(i);
      // rotation of object in radians
      
      var rotation = i * 2;
      ctx.rotate(-rotation);
      ctx.fillStyle = 'rgb(' + '5 , ' + (barHeight) + ', 25)';
      ctx.fillRect(x + 300, 100, 10, barHeight);
      ctx.rotate(2 * rotation);
      ctx.fillRect(700, 100, 10,  barHeight);
      ctx.restore();
      // set the CSS properties to calculated values
      amount++;
    }
  }


};


export default visuals;