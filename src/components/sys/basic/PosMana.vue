<template>
    <div>
        <div>
            <el-input
                size="small"
                class="addPosInput"
                v-loading="loading"
                element-loading-text="Loading, Please wait..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                placeholder="Please add new position..."
                prefix-icon="el-icon-plus"
                @keydown.enter.native="addPosition"
                v-model="pos.name">
            </el-input>
            <el-button icon="el-icon-plus" size="small" type="primary" @click="addPosition">Add</el-button>
        </div>
        <div class="posManaMain">
            <el-table
                :data="positions"
                border
                @selection-change="handleSelectionChange"
                size="small"
                stripe
                style="width: 70%">
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
                    label="Position Name"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="createDate"
                    label="Create Date"
                width="150">
                </el-table-column>
                <el-table-column
                    label="Active Status">
                    <template slot-scope="scope">
                        <el-tag style="width: 65px" type="success" v-if="scope.row.enabled">Actived</el-tag>
                        <el-tag style="width: 65px" type="danger" v-else>Inactived</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="Operation">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="showEditView(scope.$index, scope.row)">Edit</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button @click="deleteMany" type="danger" size="small" style="margin-top: 8px" :disabled="multipleSelection.length===0">Batch Delete</el-button>
        </div>
        <el-dialog
            title="Edit Position"
            :visible.sync="dialogVisible"
            width="30%">
            <div>
               <div>
                   <el-tag>Position Name</el-tag>
                   <el-input class="updatePosInput" size="small" v-model="updatePos.name"></el-input>
               </div>
                <div>
                    <el-tag>Active Status</el-tag>
                    <el-switch
                        v-model="updatePos.enabled"
                        active-text="Actived"
                        inactive-text="Inactived">
                    </el-switch>
                </div>
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
        name: "PosMana",
        data(){
            return {
                loading: false,
                pos: {
                    name:''
                },
                dialogVisible: false,
                updatePos:{
                    name:'',
                    enabled:false
                },
                multipleSelection:[],
                positions: []
            }
        },
        mounted() {
            this.initPositions();
        },
        methods: {
            deleteMany(){
                this.$confirm('This Operation will permanently Delete'+ this.multipleSelection.length  +' records, continue?', 'hit', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'cancel',
                    type: 'warning'
                }).then(() => {
                    let ids = '?';
                    this.multipleSelection.forEach(item=>{
                        ids +='ids='+item.id+'&';
                    })
                    this.deleteRequest("/system/basic/pos/"+ids).then(resp=>{
                        if (resp) {
                            this.initPositions();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Cancelled Delete'
                    });
                });
            },
            handleSelectionChange(val){
                this.multipleSelection = val;
            },
            addPosition(){
                if (this.pos.name) {
                    this.postRequest("/system/basic/pos/",this.pos).then(resp=>{
                        if (resp) {
                            this.initPositions();
                            this.pos.name = '';
                        }
                    })
                } else {
                    this.$message.error('Position name can not be null!!!');
                }
            },
            showEditView(index,data){
                Object.assign(this.updatePos, data);
                this.dialogVisible=true;

            },
            doUpdate(){
              this.putRequest("/system/basic/pos/", this.updatePos).then(resp=>{
                  if (resp) {
                      this.initPositions();
                      this.updatePos.name = '';
                      this.dialogVisible = false;
                  }
              })
            },
            handleDelete(index,data){
                this.$confirm('This operatio will permanentally delete ' + data.name + ' , continue?', 'Hit', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/pos/"+data.id).then((resp)=>{
                        if (resp) {
                            this.initPositions();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled'
                    });
                });
            },
            initPositions() {
                this.loading=true;
                this.getRequest("/system/basic/pos/").then(resp=>{
                    this.loading=false;
                    if (resp) {
                        this.positions = resp;
                    }
                })
            }
        }
    }
</script>

<style>
    .addPosInput{
        width: 300px;
        margin-right: 8px
    }

    .updatePosInput{
        width: 200px;
        margin-left: 8px;
    }

    .posManaMain{
        margin-top: 10px;
    }
</style>
