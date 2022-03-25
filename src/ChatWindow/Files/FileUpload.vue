<template>
	<div class="file-list">
        <div class="vac-file-image" :style="style">
            <div class="close-button vac-icon-remove" @click="closeFile">
                <svg-icon name="close" param="image" style="width:20px;" /></div>
            <div v-show="!file.isNotDoc" class="doc-svg">
                <svg-icon class="doc-svg-button" name="file" />
            </div>
            <div v-show="!file.isNotDoc" class="text-container">
                <div class="vac-text-ellipsis">
                    {{ file.name }}
                </div>
                <div class="vac-text-extension">
                    <center>{{ file.extension }}</center>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
    import SvgIcon from '../../components/SvgIcon.vue'

    export default {
        name: 'FileUpload',
        components: { SvgIcon },
        props: {
            index: { type: Number, default: null },
            file: { type: Object, default: null }
        },
        computed: {
            style() {
                return this.file.isNotDoc ? `background-image: url("${this.file.localUrl}");` : null
            }
        },
        methods: {
            closeFile() {
                this.$emit('close-single-file', this.index)
            }
        }
    }
</script>
<style>
.doc-svg {
    width: 32px;
    height: 32px;
    margin: auto;
    padding-top: 15px;
}
.doc-svg-button{
    width: 30px;
    height: 30px;
    margin: auto;
}
.close-button{
    max-height: 30px;
    display: flex;
    cursor: pointer;
    transition: all .2s;
}
.vac-icon-remove{
    position: absolute;
    top: 6px;
    left: 6px;
    z-index: 10;
}
.file-list{
    display: flex;
    position: relative;
    margin: 0 4px;
}
.vac-file-image{
    position: relative;
    background-color: #ddd!important;
    background-size: cover!important;
    background-position: 50%!important;
    background-repeat: no-repeat!important;
    height: 100px;
    width: 100px;
    border: 1px solid #e1e4e8;
    border-radius: 4px;
}
.vac-text-ellipsis{
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.vac-text-extension{
    font-size: 12px;
    color: #757e85;
}
.text-container{
    width: 80%;
    margin: auto;
    align-items: center;
    align-content: center;
}
</style>
