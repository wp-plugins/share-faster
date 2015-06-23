<?php
/*
Plugin Name: Share Faster
Plugin URI: http://thinkfaster.co
Description:  The fastest way to share.  Facebook, Twitter, Pinterest, LinkedIn, Google+.  Enable sharing buttons on your blog roll and on the top and bottom of each post.  Disable sharing counts if your post doesn't have enough shares.
Version: 2.9
Author: Ross Williamson
Author URI: http://thinkfaster.co/about
License: GPL
*/

$share_faster_constants = array(
  "options_field" => "share_faster_options",
);


// Read in existing option value from database
$share_faster_options = get_option($share_faster_constants["options_field"]);

$date_installed = get_option("date_installed");

if (!$date_installed) {
  $date_installed = new DateTime();
  update_option("date_installed", $date_installed);
}

$trial_time = '7 days';
$future_time = strtotime(
    $date_installed->format('Y-m-d') . ' + ' . $trial_time);
$compare_time = new DateTime(date('Y-m-d', $future_time));
$current_time = new DateTime();

$is_trial_enabled = false;
$is_trial_expired = false;
$trial_time_remaining = 0;
if ($is_trial_enabled && $current_time > $compare_time) {
  $is_trial_expired = true;
} else {
  $trial_time_remaining = $compare_time->diff($current_time);
}

function get(&$var, $default=null) {
    return isset($var) ? $var : $default;
}

function get_stripped_permalink() {
  // We get rid of the http:// and the https:// since
  // Twitter, etc work without them.  And it can screw up
  // your counts if you change from http to https
  // or vice-versa.
  $permalink = get_permalink();
  $find = array( 'http://', 'https://' );
  $replace = '';
  $permalink = str_replace( $find, $replace, $permalink );
  return $permalink;
}

function get_social_html() {
  global $share_faster_options;
  global $is_trial_expired;

  if ($is_trial_expired) {
    return "";
  }

  $title = get_the_title();
  $permalink = get_permalink();

  $imageUrl = '';

  if (has_post_thumbnail( $post->ID ) ):
    $image = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ),
        'single-post-thumbnail' );
    $imageUrl = $image[0];
  endif;

  $twitter_handle_val = $share_faster_options["twitter_handle_field"];

  $checked_twitter = get($share_faster_options["enabled_twitter"], "on");
  $checked_facebook = get($share_faster_options["enabled_facebook"], "on");
  $checked_linkedin = get($share_faster_options["enabled_linkedin"], "on");
  $checked_pinterest = get($share_faster_options["enabled_pinterest"], "on");
  $checked_googleplus = get($share_faster_options["enabled_googleplus"], "on");
  $minimum_count_val = get($share_faster_options["minimum_count_field"], 0);

  $enabled_str = sprintf("data-enabledtwitter=%s data-enabledfacebook=%s
      data-enabledlinkedin=%s data-enabledpinterest=%s
      data-enabledgoogleplus=%s", $checked_twitter, $checked_facebook,
      $checked_linkedin, $checked_pinterest, $checked_googleplus);

  $social_html = sprintf('
    <div class="thinkfaster">
      <div class="share-server-container" data-minimum-share-count="%s"
          data-url="%s" data-title="%s" data-imageUrl="%s" data-twitterhandle="%s" %s> </div>
    </div>
  ', $minimum_count_val, $permalink, $title, $imageUrl, $twitter_handle_val, $enabled_str);
  return $social_html;
}

libxml_use_internal_errors(true);

function getPlus1() {
  $url = $_POST['url'];

  $html =  file_get_contents(
      "https://plusone.google.com/_/+1/fastbutton?url=".$url);
  if (!$html) {
    echo json_encode(0);
    exit;
  }
  $doc = new DOMDocument();
  $doc->loadHTML($html);
  $counter=$doc->getElementById('aggregateCount');
  // header("Content-Type: application/json");
  echo json_encode($counter->nodeValue);
  exit;
}

add_action( 'wp_ajax_nopriv_get-plus1-count', 'getPlus1' );
add_action( 'wp_ajax_get-plus1-count', 'getPlus1' );

function faster_share_scripts() {
  wp_register_script('handlebars', plugins_url('/handlebars.runtime-v3.0.0.js', __FILE__),
      array());
  wp_register_script('templates', plugins_url('/templates.js', __FILE__),
      array('handlebars'));
  wp_register_script('share', plugins_url('/share.js', __FILE__),
      array('jquery', 'templates', 'handlebars'));

  $params = array( 'ajaxUrl' => admin_url( 'admin-ajax.php' ) );
  wp_localize_script( 'share', 'WP_params', $params  );


  wp_enqueue_style( 'genericons', plugins_url('/genericons.css', __FILE__));
  wp_enqueue_style( 'share', plugins_url('/share-faster.css', __FILE__));

  wp_enqueue_script('share');
  // wp_enqueue_script('templates');
}

add_action('wp_enqueue_scripts', 'faster_share_scripts' );


function add_social_buttons($content) {
  global $share_faster_options;
  $checked_showTop = get($share_faster_options["enabled_showTop"], "on");
  $checked_showBottom = get($share_faster_options["enabled_showBottom"], "on");

  if ($checked_showTop == "on") {
    $content = get_social_html() . $content;
  }

  if ($checked_showBottom == "on") {
    $content = $content . get_social_html();
  }
  return $content;
}
add_filter( 'the_content', 'add_social_buttons' );


function add_social_buttons_excerpt( $excerpt ) {
  global $share_faster_options;
  $checked_showIndex = get($share_faster_options["enabled_showIndex"], "on");

  if ($checked_showIndex == "off") {
    return $excerpt;
  }
  return get_social_html() . $excerpt;
}

add_filter( 'the_excerpt', 'add_social_buttons_excerpt' );

include('share-faster-admin.php');

?>
