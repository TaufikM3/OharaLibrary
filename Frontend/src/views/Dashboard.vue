<template>
    <span class="dashboard">
        <student v-if="userInfo.type === 'Student' || userInfo.type === 'student'" />
        <employee v-if="userInfo.type === 'Employee' || userInfo.type === 'employee'" />
    </span>
</template>

<script>

</script>

<style>
.dashboard {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
}
</style>
