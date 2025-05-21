import '@shoelace-style/shoelace/dist/components/alert/alert';
import '@shoelace-style/shoelace/dist/components/icon/icon';

function escapeHtml(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

export function notify(message, variant = 'warning', icon = 'exclamation-triangle', duration = 3000) {
    const formAlert = Object.assign(document.createElement('sl-alert'), {
        duration: duration,
        closable: true,
        countdown: 'rtl',
        variant: variant,
        innerHTML: `
            <sl-icon name="${icon}" slot="icon"></sl-icon>
            ${escapeHtml(message)}
        `
    });

    document.body.append(formAlert);
    return formAlert.toast();
}