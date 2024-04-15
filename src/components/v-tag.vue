<template>
    <uv-tags
        :text="'# ' + props.item.tag_name"
        color="#333"
        shape="circle"
        plain
        bgColor="#f6f6f6"
        type="primary"
        borderColor="transparent"
        @click="handleClick"
        style="font-weight: bold"
    />
</template>
<script setup>
const props = defineProps({
    item: Object
});

function handleClick() {
    if (props.item.noNavigate) {
        uni.showToast({
            title: '禁止套娃',
            icon: 'none'
        });
        return;
    }
    uni.navigateTo({
        url: `/pages/Tag?value=${props.item.tag_link}&title=${props.item.tag_name}`
    });
}
</script>
