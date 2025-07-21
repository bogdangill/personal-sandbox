import SimpleBar from 'simplebar';

function escapeHtml(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

export const showScroll = (container) => new SimpleBar(container, {
    scrollbarMinSize: 20
});

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

export async function fillDescriptionForm(form) {
    const title = await fetch('https://fish-text.ru/get?&type=title&number=1')
        .then(res => res.json())
        .catch(err => {
            notify(`${err} для &type=title`, 'danger');
            return {text: 'default title'};
        });
    const description = await fetch('https://fish-text.ru/get?&type=paragraph&number=2')
        .then(res => res.json())
        .catch(err => {
            notify(`${err} для &type=paragraph`, 'danger');
            return {text: 'депрессивный дескрипшн надо сгенерить какой-то бред из головы'}
        });

    form.input.value = title.text;
    form.textarea.value = description.text;
    form.textarea.dispatchEvent(new CustomEvent('sl-input')); //для валидации по disableSubmitButton()
}