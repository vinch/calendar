<?php date_default_timezone_set('GMT') ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Calendar</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>Calendar</h1>
  <div id="calendar" class="clearfix">
    <div class="side">
      <?php for ($i=0; $i<=720; $i+=30) : ?>
        <?php $seconds = (9*60+$i)*60 ?>
        <?php if ($i%60 === 0) : ?>
          <div class="hour"><strong><?php echo date('g:i', $seconds) ?></strong> <?php echo date('A', $seconds) ?></div>
        <?php else : ?>
          <div class="half"><?php echo date('g:i', $seconds) ?></div>
        <?php endif; ?>
      <?php endfor; ?>
    </div>
    <div class="content">
      <div class="inner">
        <div class="event bbox" style="width:{{width}}px; height:{{height}}px; top:{{top}}px; left:{{left}}px;">
          <h2><a href="#">Event #{{id}}</a></h2>
          <h3>{{start}} → {{end}}</h3>
        </div>
      </div>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>