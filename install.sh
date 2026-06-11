#!/usr/bin/env bash
set -euo pipefail

echo "Installing Pi-hole CPU temperature customization..."

install -m 0755 write-pihole-cputemp-json /usr/local/sbin/write-pihole-cputemp-json
install -m 0755 reapply-pihole-cputemp /usr/local/sbin/reapply-pihole-cputemp
install -m 0755 pihole-update /usr/local/sbin/pihole-update

mkdir -p /var/www/html/admin/custom
install -m 0644 custom/cputemp.js /var/www/html/admin/custom/cputemp.js

install -m 0644 systemd/pihole-cputemp-json.service /etc/systemd/system/pihole-cputemp-json.service
install -m 0644 systemd/pihole-cputemp-json.timer /etc/systemd/system/pihole-cputemp-json.timer
install -m 0644 systemd/pihole-cputemp-reapply.service /etc/systemd/system/pihole-cputemp-reapply.service
install -m 0644 systemd/pihole-cputemp-reapply.path /etc/systemd/system/pihole-cputemp-reapply.path

install -m 0644 apt/99-pihole-cputemp-reapply /etc/apt/apt.conf.d/99-pihole-cputemp-reapply

systemctl daemon-reload

systemctl enable --now pihole-cputemp-json.timer
systemctl enable --now pihole-cputemp-reapply.path

/usr/local/sbin/write-pihole-cputemp-json
/usr/local/sbin/reapply-pihole-cputemp

echo
echo "Done."
echo "Verify with:"
echo "  systemctl status pihole-cputemp-json.timer"
echo "  systemctl status pihole-cputemp-reapply.path"
echo "  grep -n cputemp.js /var/www/html/admin/scripts/lua/footer.lp"
echo "  curl -s http://127.0.0.1/admin/custom/cputemp.json"
