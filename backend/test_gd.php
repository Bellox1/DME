<?php
echo "PHP Version: " . phpversion() . "\n";
echo "Loaded php.ini: " . php_ini_loaded_file() . "\n";
echo "GD Extension loaded: " . (extension_loaded('gd') ? 'YES' : 'NO') . "\n";
if (extension_loaded('gd')) {
    $info = gd_info();
    echo "GD Version: " . $info['GD Version'] . "\n";
}
