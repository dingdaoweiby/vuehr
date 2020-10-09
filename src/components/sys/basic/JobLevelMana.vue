<template>
    <div>
        <div>
            <el-input size="small" v-model="jl.name" style="width: 300px" prefix-icon="el-icon-plus" placeholder="Adding Job Level"></el-input>
            <el-select v-model="jl.titleLevel" placeholder="Job Title Level..." size="small" style="margin-left: 5px;margin-right: 5px">
                <el-option
                    v-for="item in titleLevels"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
            </el-select>
            <el-button icon="el-icon-plus" type="primary" size="small" @click="addJobLevel">Add</el-button>
        </div>
        <div style="margin-top: 10px">
            <el-table
                :data="jls"
                border
                v-loading="loading"
                element-loading-text="Loading, Please wait..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                size="small"
                @selection-change="handleSelectionChange"
                style="width: 80%">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="ID"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="Title Name"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="titleLevel"
                    label="Title Level">
                </el-table-column>
                <el-table-column
                    prop="createDate"
                    label="Create Date">
                </el-table-column>
                <el-table-column
                    label="Active Status">
                    <template slot-scope="scope">
                        <el-tag style="width: 65px" v-if="scope.row.enabled" type="success">Actived</el-tag>
                        <el-tag style="width: 65px" v-else type="danger">Inactived</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="Operation">
                    <template slot-scope="scope">
                        <el-button size="small" @click="showEditView(scope.row)">Edit</el-button>
                        <el-button size="small" type="danger" @click="deleteHandler(scope.row)">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="danger" size="small" style="margin-top: 10px" :disabled="multipleSelection.length===0" @click="deleteMany">Batch Delete</el-button>
        </div>
        <el-dialog
            title="Edit Job Level"
            :visible.sync="dialogVisible"
            width="30%">
            <div>
                <table>
                    <tr>
                        <td><el-tag>Job Level Name</el-tag></td>
                        <td><el-input size="small" v-model="updateJl.name"></el-input></td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>Job Level</el-tag>
                        </td>
                        <td>
                            <el-select v-model="updateJl.titleLevel" placeholder="Job Title Level..." size="small"
                                       style="margin-left: 5px;margin-right: 5px">
                                <el-option
                                    v-for="item in titleLevels"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td><el-tag>Status</el-tag></td>
                        <td>
                            <el-switch
                                v-model="updateJl.enabled"
                                active-text="Actived"
                                inactive-text="Inactived">
                            </el-switch>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="doUpdate">Confirm</el-button>
                <el-button size="small" @click="dialogVisible = false">Cancel</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        name: "JobLevelMana",
        data() {
            return {
                loading: false,
                dialogVisible: false,
                multipleSelection: [],
                updateJl:{
                    name:'',
                    titleLevel:'',
                    enabled: false
                },
                jl: {
                    name:'',
                    titleLevel:''
                },
                jls:[],
                titleLevels:[
                    '正高级',
                    '副高级',
                    '中级',
                    '初级',
                    '员级'
                ]
            }
        },
        mounted() {
            this.initJls();
        },
        methods:{
            deleteMany(){
                this.$confirm('this operation will permanently delete '+this.multipleSelection.length+' record(s), continue?', 'Hit', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    let ids = '?';
                    this.multipleSelection.forEach(item=>{
                        ids += 'ids=' + item.id + '&';
                    });
                    this.deleteRequest("/system/basic/joblevel/" + ids).then(resp=>{
                        if (resp) {
                            this.initJls();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Cancel Delete....'
                    });
                });
            },
            doUpdate() {
                this.putRequest("/system/basic/joblevel/", this.updateJl).then(resp=>{
                    if (resp) {
                        this.initJls();
                        this.dialogVisible = false;
                    }
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            showEditView(data) {
                Object.assign(this.updateJl, data);
                this.dialogVisible = true;
            },
            deleteHandler(data){
                this.$confirm('This operation will delete '+data.name +' position, continue?', 'hit', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/joblevel/" + data.id).then(resp=>{
                        if (resp) {
                            this.initJls();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Canceling Delete..'
                    });
                });

            },
            addJobLevel(){
                if (this.jl.name && this.jl.titleLevel) {
                    this.postRequest("/system/basic/joblevel/", this.jl).then(resp=>{
                        if (resp) {
                            this.initJls();
                        }
                    });
                } else {
                    this.$message.error("Adding Fields can not be null!!!");
                }
            },
            initJls() {
                this.loading=true;
                this.getRequest("/system/basic/joblevel/").then(resp=>{
                    this.loading=false;
                    if (resp) {
                        this.jls= resp;
                        this.jl={
                            name:'',
                            titleLevel:''
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
