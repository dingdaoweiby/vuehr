<template>
    <div>
        <div style="display: flex;justify-content: space-between">
            <div>
                <el-input placeholder="Please Enter Employee Name" prefix-icon="el-icon-search"
                          style="width: 300px; margin-right: 10px"
                          clearable
                          @clear="initEmps"
                          v-model="keyword" @keydown.enter.native="initEmps"></el-input>
                <el-button icon="el-icon-search" type="primary" @click="initEmps">Search</el-button>
                <el-button type="primary">
                    <i class="fa fa-angle-double-down" aria-hidden="true"/>
                    Advanced Search
                </el-button>
            </div>
            <div>
                <el-button type="success">
                    <i class="fa fa-level-up" aria-hidden="true"/>
                    Input Data
                </el-button>
                <el-button type="success">
                    <i class="fa fa-level-down" aria-hidden="true"/>
                    Output Data
                </el-button>
                <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">
                    Add User
                </el-button>
            </div>
        </div>
        <div style="margin-top: 10px">
            <el-table
                :data="emps"
                stripe
                border
                v-loading="loading"
                element-loading-text="Loading data, Please wait..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                style="width: 100%">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="name"
                    fixed
                    align="left"
                    label="Name"
                    width="90">
                </el-table-column>
                <el-table-column
                    prop="workID"
                    label="Emp ID"
                    align="left"
                    width="85">
                </el-table-column>
                <el-table-column
                    prop="birthday"
                    width="95"
                    align="left"
                    label="Birthday">
                </el-table-column>
                <el-table-column
                    prop="idCard"
                    width="150"
                    align="left"
                    label="ID Number">
                </el-table-column>
                <el-table-column
                    prop="wedlock"
                    width="70"
                    label="Marriage">
                </el-table-column>
                <el-table-column
                    prop="nation.name"
                    width="120"
                    label="Nationality">
                </el-table-column>
                <el-table-column
                    prop="nativePlace"
                    width="120"
                    label="Original From">
                </el-table-column>
                <el-table-column
                    prop="politicsstatus.name"
                    label="Politics">
                </el-table-column>
                <el-table-column
                    prop="email"
                    width="180"
                    align="left"
                    label="Email">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    width="100"
                    align="left"
                    label="Phone#">
                </el-table-column>
                <el-table-column
                    prop="address"
                    width="220"
                    align="left"
                    label="Address">
                </el-table-column>
                <el-table-column
                    prop="department.name"
                    width="100"
                    align="left"
                    label="Department">
                </el-table-column>
                <el-table-column
                    prop="position.name"
                    width="100"
                    label="Position">
                </el-table-column>
                <el-table-column
                    prop="jobLevel.name"
                    width="110"
                    label="Job Level">
                </el-table-column>
                <el-table-column
                    prop="engageForm"
                    width="100"
                    align="left"
                    label="Hiring Form">
                </el-table-column>
                <el-table-column
                    prop="beginDate"
                    width="85"
                    align="left"
                    label="Address">
                </el-table-column>
                <el-table-column
                    prop="conversionTime"
                    width="85"
                    align="left"
                    label="Covt Time">
                </el-table-column>
                <el-table-column
                    prop="beginContract"
                    width="95"
                    align="left"
                    label="Contr Start">
                </el-table-column>
                <el-table-column
                    prop="endContract"
                    width="95"
                    align="left"
                    label="Contr End">
                </el-table-column>
                <el-table-column
                    width="100"
                    align="left"
                    label="Con Ter">
                    <template slot-scope="scope">
                        <el-tag>{{ scope.row.contractTerm }}</el-tag>
                        Year
                    </template>
                </el-table-column>
                <el-table-column
                    prop="tiptopDegree"
                    label="Top Degree">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    width="200"
                    label="Operation">
                    <template slot-scope="scope">
                        <el-button style="padding: 3px" size="mini">Edit</el-button>
                        <el-button style="padding: 3px" size="mini" type="primary">Adv Cont</el-button>
                        <el-button @click="deleteEmp(scope.row)" style="padding: 3px" size="mini" type="danger">Delete
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="display: flex; justify-content: flex-end">
                <el-pagination
                    background
                    @current-change="currentChange"
                    @size-change="sizeChange"
                    layout="sizes, prev, pager, next, jumper, ->, total, slot"
                    :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog
            title="Add Employee"
            :visible.sync="dialogVisible"
            width="80%">
            <div>
                <el-form :model="emp" :rules="rules" ref="empForm">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="Name : " prop="name">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" v-model="emp.name"
                                          placeholder="Please enter Employee name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="Gender : " prop="gender">
                                <el-radio-group v-model="emp.gender">
                                    <el-radio label="男">Male</el-radio>
                                    <el-radio label="女">Female</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="Birthday: " prop="birthday">
                                <el-date-picker
                                    v-model="emp.birthday"
                                    size="mini"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    style="width: 150px"
                                    placeholder="Birthday">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="Politic Status: " prop="politicId">
                                <el-select v-model="emp.politicId" placeholder="PoliticStat" size="mini" style="width:
                                200px">
                                    <el-option
                                        v-for="item in politicsstatus"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="Nation : " prop="nationId">
                                <el-select v-model="emp.nationId" placeholder="Nationality" size="mini" style="width:
                                150px">
                                    <el-option
                                        v-for="item in nations"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="Original From : " prop="nativePlace">
                                <el-input size="mini" style="width: 120px" prefix-icon="el-icon-edit"
                                          v-model="emp.nativePlace"
                                          placeholder="Please enter your native place"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="Email Address : " prop="email">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-message"
                                          v-model="emp.email"
                                          placeholder="Please enter your Email Address"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="Address : " prop="address">
                                <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                                          v-model="emp.address"
                                          placeholder="Please enter your address"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="Position : " prop="posId">
                                <el-select v-model="emp.posId" placeholder="Position" size="mini" style="width:
                                150px">
                                    <el-option
                                        v-for="item in positions"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="Jo Le:" prop="jobLevelId">
                                <el-select v-model="emp.jobLevelId" placeholder="Job Level" size="mini" style="width:
                                120px">
                                    <el-option
                                        v-for="item in joblevels"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="Department : " prop="departmentId">
                                <el-popover
                                    placement="right"
                                    title="Please select department"
                                    width="200"
                                    trigger="manual"
                                    v-model="popVisible">
                                    <el-tree default-expand-all :data="allDeps" :props="defaultProps"
                                                 @node-click="handleNodeClick"></el-tree>
                                    <div slot="reference" style="width: 150px;display: inline-flex;font-size: 13px;border: 1px solid
                                                        #dedede;height: 26px;border-radius: 5px;
                                                        cursor: pointer;align-items: center;
                                                        padding-left: 8px;box-sizing: border-box"
                                         @click="showDepView">{{inputDepName}}</div>
                                </el-popover>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="phone : " prop="phone">
                                <el-input size="mini" style="width: 200px" prefix-icon="el-icon-phone"
                                          v-model="emp.phone"
                                          placeholder="Please enter your address"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="EmpId : " prop="workID">
                                <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit"
                                          v-model="emp.workID"
                                          placeholder="Please enter your EmpId" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="Dg:" prop="tiptopDegree">
                                <el-select v-model="emp.tiptopDegree" placeholder="tiptopDegree" size="mini" style="width:
                                150px">
                                    <el-option
                                        v-for="item in tiptopDegrees"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="Gr Fr : " prop="school">
                                <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                                          v-model="emp.school"
                                          placeholder="Please enter your school"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="Major : " prop="specialty">
                                <el-input size="mini" style="width: 200px" prefix-icon="el-icon-edit"
                                          v-model="emp.specialty"
                                          placeholder="Please enter your specialty"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="Begin Date: " prop="beginDate">
                                <el-date-picker
                                    v-model="emp.beginDate"
                                    size="mini"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    style="width: 130px"
                                    placeholder="Begin Date">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="Conversion Date: " prop="conversionTime">
                                <el-date-picker
                                    v-model="emp.conversionTime"
                                    size="mini"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    style="width: 130px"
                                    placeholder="conversion Time">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="Contract Begin: " prop="beginContract">
                                <el-date-picker
                                    v-model="emp.beginContract"
                                    size="mini"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    style="width: 130px"
                                    placeholder="Contract Begin">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="Contract End : " prop="endContract">
                                <el-date-picker
                                    v-model="emp.endContract"
                                    size="mini"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    style="width: 130px"
                                    placeholder="Contract End">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="ID Card # : " prop="idCard">
                                <el-input size="mini" style="width: 180px" prefix-icon="el-icon-edit"
                                          v-model="emp.idCard"
                                          placeholder="Please enter your idCard #"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="Hiring Type : " prop="engageForm">
                                <el-radio-group v-model="emp.engageForm">
                                    <el-radio label="劳动合同">劳动合同</el-radio>
                                    <el-radio label="劳务合同">劳务合同</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="Marriage Statuc : " prop="wedlock">
                                <el-radio-group v-model="emp.wedlock">
                                    <el-radio label="未婚">未婚</el-radio>
                                    <el-radio label="已婚">已婚</el-radio>
                                    <el-radio label="离异">离异</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="doAddEmp">Confirm</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "EmpBasic",
    data() {
        return {
            allDeps: [],
            emps: [],
            loading: false,
            dialogVisible: false,
            popVisible: false,
            total: 0,
            page: 1,
            size: 10,
            keyword: '',
            nations: [],
            joblevels: [],
            politicsstatus: [],
            positions: [],
            inputDepName:'',
            tiptopDegrees: ['本科', '大专', '硕士', '博士', '高中', '初中', '小学', '其他'],
            options: [{
                value: '选项1',
                label: '黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            }, {
                value: '选项3',
                label: '蚵仔煎'
            }, {
                value: '选项4',
                label: '龙须面'
            }, {
                value: '选项5',
                label: '北京烤鸭'
            }],
            emp: {
                name: "javaboy",
                gender: "男",
                birthday: "1990-01-01",
                idCard: "610122199001011256",
                wedlock: "已婚",
                nationId: 1,
                nativePlace: "陕西",
                politicId: 13,
                email: "laowang@qq.com",
                phone: "18565558897",
                address: "深圳市南山区",
                departmentId: 5,
                jobLevelId: 9,
                posId: 29,
                engageForm: "劳务合同",
                tiptopDegree: "本科",
                specialty: "信息管理与信息系统",
                school: "深圳大学",
                beginDate: "2018-01-01",
                workState: "在职",
                workID: "00000001",
                contractTerm: 2.0,
                conversionTime: "2018-04-01",
                notWorkDate: null,
                beginContract: "2018-01-01",
                endContract: "2020-01-01",
                workAge: null
            },
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            rules: {
                name:[{required:true, message:"please enter name", trigger:"blur"}],
                gender:[{required:true, message:"please enter gender", trigger:"blur"}],
                birthday:[{required:true, message:"please enter birthday", trigger:"blur"}],
                idCard:[{required:true, message:"please enter idCard #", trigger:"blur"},
                    {
                        pattern:/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                        message:'id Card # form incorrect!!!',
                        trigger: 'blur'
                    }],
                nationId:[{required:true, message:"please enter nationId", trigger:"blur"}],
                nativePlace:[{required:true, message:"please enter nativePlace", trigger:"blur"}],
                politicId:[{required:true, message:"please enter politicId", trigger:"blur"}],
                email:[{required:true, message:"please enter email", trigger:"blur"},{type:'email',message:
                        'Email form incorrect!!!',trigger: 'blur'}],
                phone:[{required:true, message:"please enter phone", trigger:"blur"}],
                address:[{required:true, message:"please enter address", trigger:"blur"}],
                departmentId:[{required:true, message:"please enter departmentId", trigger:"blur"}],
                jobLevelId:[{required:true, message:"please enter jobLevelId", trigger:"blur"}],
                posId:[{required:true, message:"please enter posId", trigger:"blur"}],
                engageForm:[{required:true, message:"please enter engageForm", trigger:"blur"}],
                tiptopDegree:[{required:true, message:"please enter tiptopDegree", trigger:"blur"}],
                specialty:[{required:true, message:"please enter specialty", trigger:"blur"}],
                school:[{required:true, message:"please enter school", trigger:"blur"}],
                beginDate:[{required:true, message:"please enter beginDate", trigger:"blur"}],
                workState:[{required:true, message:"please enter workState", trigger:"blur"}],
                workID:[{required:true, message:"please enter workID", trigger:"blur"}],
                contractTerm:[{required:true, message:"please enter contractTerm", trigger:"blur"}],
                conversionTime:[{required:true, message:"please enter conversionTime", trigger:"blur"}],
                notWorkDate:[{required:true, message:"please enter notWorkDate", trigger:"blur"}],
                beginContract:[{required:true, message:"please enter beginContract", trigger:"blur"}],
                endContract:[{required:true, message:"please enter endContract", trigger:"blur"}],
                workAge:[{required:true, message:"please enter workAge", trigger:"blur"}],
            }
        }
    },
    mounted() {
        this.initEmps();
        this.initData();
    },
    methods: {
        deleteEmp(data) {
                this.$confirm('This operation will permanently delete : ' + data.name + ', continue?', 'hit', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/employee/basic/"+data.id).then(resp=>{
                        if (resp) {
                            this.initEmps();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete Cancelled....'
                    });
                });
        },
        doAddEmp() {
            this.$refs['empForm'].validate((valid)=>{
                if (valid) {
                    this.postRequest("/employee/basic/",this.emp).then(resp=>{
                        if (resp) {
                            this.dialogVisible=false;
                            this.initEmps();
                        }
                    })
                }
            })
        },
        handleNodeClick(data) {
            this.popVisible = !this.popVisible;
            this.departmentId=data.id;
            this.inputDepName=data.name;
        },
        showDepView() {
            this.popVisible = !this.popVisible;
        },
        initPosition() {
            if (!window.sessionStorage.getItem("positions")) {
                this.getRequest('/employee/basic/positions').then(resp => {
                    if (resp) {
                        this.positions = resp;
                    }
                })
            }
        },
        getMaxWorkID() {
            this.getRequest("/employee/basic/maxWorkID").then(resp => {
                if (resp) {
                    this.emp.workID = resp.obj;
                }
            })
        },
        initData() {
            if (!window.sessionStorage.getItem("nations")) {
                this.getRequest('/employee/basic/nations').then(resp => {
                    if (resp) {
                        this.nations = resp;
                        window.sessionStorage.setItem("nations", JSON.stringify(resp));
                    }
                })
            } else {
                this.nations = JSON.parse(window.sessionStorage.getItem("nations"));
            }
            if (!window.sessionStorage.getItem("joblevels")) {
                this.getRequest('/employee/basic/joblevels').then(resp => {
                    if (resp) {
                        this.joblevels = resp;
                        window.sessionStorage.setItem("joblevels", JSON.stringify(resp));
                    }
                })
            } else {
                this.joblevels = JSON.parse(window.sessionStorage.getItem("joblevels"))
            }
            if (!window.sessionStorage.getItem("politicsstatus")) {
                this.getRequest('/employee/basic/politicsstatus').then(resp => {
                    if (resp) {
                        this.politicsstatus = resp;
                        window.sessionStorage.setItem("politicsstatus", JSON.stringify(resp));
                    }
                })
            } else {
                this.politicsstatus= JSON.parse(window.sessionStorage.getItem("politicsstatus"))
            }
            if (!window.sessionStorage.getItem("deps")) {
                this.getRequest('/employee/basic/deps').then(resp => {
                    if (resp) {
                        this.allDeps = resp;
                        window.sessionStorage.setItem("deps", JSON.stringify(resp));
                    }
                })
            } else {
                this.allDeps= JSON.parse(window.sessionStorage.getItem("deps"))
            }
        },
        sizeChange(currentSize) {
            this.size = currentSize;
            this.initEmps();
        },
        currentChange(currentPage) {
            this.page = currentPage;
            this.initEmps();
        },
        showAddEmpView() {
            this.dialogVisible = true;
            this.initPosition();
            this.getMaxWorkID();
        },
        initEmps() {
            this.loading = true;
            this.getRequest("/employee/basic/?page=" + this.page + "&size=" + this.size + '&keyword=' + this.keyword).then(resp => {
                this.loading = false;
                if (resp) {
                    this.emps = resp.data;
                    this.total = resp.total;
                }
            })
        }
    }
}
</script>

<style scoped>

</style>
