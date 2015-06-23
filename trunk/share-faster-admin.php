<?php

add_action( 'admin_menu', 'faster_share_menu' );

function faster_share_menu() {
  add_options_page( 'Share Faster Options', 'Share Faster',
      'manage_options', 'faster-share-options', 'faster_share_options' );
}

function faster_share_options() {
  global $share_faster_options;
  global $share_faster_constants;

  if ( !current_user_can( 'manage_options' ) )  {
    wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
  }

  $twitter_handle_val = $share_faster_options["twitter_handle_field"];
  $minimum_count_val = get($share_faster_options["minimum_count_field"], 0);
  $checked_twitter = get($share_faster_options["enabled_twitter"], "on");
  $checked_facebook = get($share_faster_options["enabled_facebook"], "on");
  $checked_linkedin = get($share_faster_options["enabled_linkedin"], "on");
  $checked_pinterest = get($share_faster_options["enabled_pinterest"], "on");
  $checked_googleplus = get($share_faster_options["enabled_googleplus"], "on");
  $checked_showBottom = get($share_faster_options["enabled_showBottom"], "on");
  $checked_showTop = get($share_faster_options["enabled_showTop"], "on");
  $checked_showIndex = get($share_faster_options["enabled_showIndex"], "on");

 // variables for the field and option names
  // $opt_name = 'mt_favorite_color';
  $hidden_field_name = 'mt_submit_hidden';

  // See if the user has posted us some information
  // If they did, this hidden field will be set to 'Y'
  if( isset($_POST[ $hidden_field_name ]) && $_POST[ $hidden_field_name ] == 'Y' ) {
      // Read their posted value
      $twitter_handle_val = get($_POST[ "twitter_handle_field" ], '');
      $twitter_enabled = get($_POST[ "enabled_twitter" ], "off");
      $facebook_enabled = get($_POST[ "enabled_facebook" ], "off");
      $linkedin_enabled = get($_POST[ "enabled_linkedin" ], "off");
      $pinterest_enabled = get($_POST[ "enabled_pinterest" ], "off");
      $googleplus_enabled = get($_POST[ "enabled_googleplus" ], "off");
      $showTop_enabled = get($_POST["enabled_showTop"], "off");
      $showBottom_enabled = get($_POST["enabled_showBottom"], "off");
      $showIndex_enabled = get($_POST["enabled_showIndex"], "off");
      $minimum_count_val = get($_POST["minimum_count_field"], 0);

      $options = array("twitter_handle_field" => $twitter_handle_val);
      $options["enabled_twitter"] = $twitter_enabled;
      $options["enabled_facebook"] = $facebook_enabled;
      $options["enabled_linkedin"] = $linkedin_enabled;
      $options["enabled_pinterest"] = $pinterest_enabled;
      $options["enabled_googleplus"] = $googleplus_enabled;
      $options["enabled_showTop"] = $showTop_enabled;
      $options["enabled_showBottom"] = $showBottom_enabled;
      $options["enabled_showIndex"] = $showIndex_enabled;
      $options["minimum_count_field"] = $minimum_count_val;

      // Save the posted value in the database
      update_option( $share_faster_constants["options_field"], $options );
      // Make sure the value is there immediately.
      $opt_twitter_handle_val = $twitter_handle_val;
      $checked_twitter = $twitter_enabled;
      $checked_facebook = $facebook_enabled;
      $checked_linkedin = $linkedin_enabled;
      $checked_pinterest = $pinterest_enabled;
      $checked_googleplus = $googleplus_enabled;
      $checked_showTop = $showTop_enabled;
      $checked_showBottom = $showBottom_enabled;
      $checked_showIndex = $showIndex_enabled;
      $opt_minimum_count_val = $minimum_count_val;

        // Put an settings updated message on the screen

?>
<div class="updated"><p><strong><?php _e('settings saved.', 'menu-test' ); ?></strong></p></div>
<?php

    }

    // Now display the settings editing screen

    echo '<div class="wrap">';

    global $is_trial_enabled;
    global $trial_time_remaining;
    global $is_trial_expired;
    if ($is_trial_enabled) {
      $buyurl = "/share-faster";

      if ($is_trial_expired) {
        printf('<h2 class="trial-message"> Your trial is expired.  <a href="%s"> Buy Now </a></h2>', $buyurl);

      } else {
        printf('<h2 class="trial-message"> You have %d days left in your trial.  <a href="%s"> Buy Now </a></h2>', $trial_time_remaining->days, $buyurl);

      }
    }

    echo "<h2>" . __( 'Share Faster Settings', 'menu-test' ) . "</h2>";

    // settings form

?>

<style>
.trial-message {
  background-color: #DDD;
  display: inline-block;
  padding: 10px !important;
  margin-bottom: 10px;
}

</style>

<form name="form1" method="post" action="">
<input type="hidden" name="<?php echo $hidden_field_name; ?>" value="Y">

<p><?php _e("Twitter Handle: @&nbsp;", 'menu-test' ); ?>
<input type="text" name="twitter_handle_field"
    value="<?php echo $twitter_handle_val; ?>" size="20">
</p>
<p><?php _e("Minimum Number of Shares Before Showing Counts: &nbsp;", 'menu-test' ); ?>
<input type="text" name="minimum_count_field"
    value="<?php echo $minimum_count_val; ?>">
</p>

<?php
echo "<h3>" . __('Enable Social Networks') . "</h3>";
?>

<p>
  <table>
    <tr>
      <td>
  <?php _e("Twitter", 'menu-test' ); ?>
  </td>
  <td>
  <input type="checkbox" name="enabled_twitter"
      <?php checked( $checked_twitter, "on"); ?> >
  </td>
    </tr>

  <tr>
    <td>
  <?php _e("Facebook &nbsp;", 'menu-test' ); ?>
  </td>
  <td>
  <input type="checkbox" name="enabled_facebook"
      <?php checked( $checked_facebook, "on"); ?> >
  </td>
  </tr>

  <tr>
    <td>
  <?php _e("LinkedIn &nbsp;", 'menu-test' ); ?>
  </td>
  <td>
  <input type="checkbox" name="enabled_linkedin"
      <?php checked( $checked_linkedin, "on"); ?> >
  </td>
  </tr>

  <tr>
    <td>
  <?php _e("Pinterest &nbsp;", 'menu-test' ); ?>
  </td>
  <td>
  <input type="checkbox" name="enabled_pinterest"
      <?php checked( $checked_pinterest, "on"); ?> >
  </td>
  </tr>

  <tr>
    <td>
  <?php _e("Google Plus &nbsp;", 'menu-test' ); ?>
  </td>
  <td>
  <input type="checkbox" name="enabled_googleplus"
      <?php checked( $checked_googleplus, "on"); ?> >
  </td>
  </tr>

  </table>
</p>

<?php
echo "<h3>" . __('Location on Page') . "</h3>";
?>
  <table>
    <tr>
      <td>
  <?php _e("Show at Top of Post", 'menu-test' ); ?>
  </td>
  <td>
  <input type="checkbox" name="enabled_showTop"
      <?php checked( $checked_showTop, "on"); ?> >
  </td>
    </tr>

    <tr>
      <td>
  <?php _e("Show at Bottom of Post&nbsp;&nbsp;", 'menu-test' ); ?>
  </td>
  <td>
  <input type="checkbox" name="enabled_showBottom"
      <?php checked( $checked_showBottom, "on"); ?> >
  </td>
    </tr>

    <tr>
      <td>
  <?php _e("Show on Index Page&nbsp;&nbsp;", 'menu-test' ); ?>
  </td>
  <td>
  <input type="checkbox" name="enabled_showIndex"
      <?php checked( $checked_showIndex, "on"); ?> >
  </td>
    </tr>
  </table>


<p class="submit">
<input type="submit" name="Submit" class="button-primary" value="<?php esc_attr_e('Save Changes') ?>" />
</p>

</form>
</div>

<?php

}

?>