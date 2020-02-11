import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/core/models/general/role.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { DatabaseService } from 'src/app/core/database.service';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { combineLatest, Observable } from 'rxjs';
import { startWith, filter, map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-create-new-permit',
  templateUrl: './create-new-permit.component.html',
  styles: []
})
export class CreateNewPermitComponent implements OnInit {

  loading: boolean = false;
  nameExist$: Observable<boolean>;

  permitsResults: Array<Role> = [];

  detailsFormGroup: FormGroup;
  permitsConfigurationFormGroup: FormGroup;

  securitySelection = new SelectionModel<any>(true, []);
  securityKeys: Array<any> = [
    { name: 'FRED', value: 'securityFred' },
    { name: 'Formulario FRED', value: 'securityFredForm' },
    { name: 'Lista general FRED', value: 'securityFredGeneralList' },
    { name: 'Lista personal FRED', value: 'securityFredPersonalList' },
    { name: 'Descargar FRED', value: 'securityFredDownload' },
    { name: 'Editar FRED', value: 'securityFredEdit' },
    { name: 'Eliminar FRED', value: 'securityFredDelete' },
    { name: 'Inspecciones', value: 'securityInspections' },
    { name: 'Cronograma de Inspecciones', value: 'securityInspectionsCrono' },
    { name: 'Lista general de Inspecciones', value: 'securityInspectionsGeneralList' },
    { name: 'Lista personal de Inspecciones', value: 'securityInspectionsPersonalList' },
    { name: 'Descargar Inspecciones', value: 'securityInspectionsDownload' },
    { name: 'Editar Inspecciones', value: 'securityInspectionsEdit' },
    { name: 'Eliminar Inspecciones', value: 'securityInspectionsDelete' },
    { name: 'Tareas', value: 'securityTasks' },
    { name: 'Lista general de Tareas', value: 'securityTasksGeneralList' },
    { name: 'Lista personal de Tareas', value: 'securityTasksPersonalList' },
    { name: 'Editar Tareas', value: 'securityTasksEdit' },
    { name: 'Eliminar Tareas', value: 'securityTasksDelete' },
  ];

  qualitySelection = new SelectionModel<any>(true, []);
  qualityKeys: Array<any> = [
    { name: 'Rehaceres', value: 'qualityRedos' },
    { name: 'Lista general de Rehaceres', value: 'qualityRedosGeneralList' },
    { name: 'Lista personal de Rehaceres', value: 'qualityRedosPersonalList' },
    { name: 'Descargar Rehaceres', value: 'qualityRedosDownload' },
    { name: 'Editar Rehaceres', value: 'qualityRedosEdit' },
    { name: 'Eliminar Rehaceres', value: 'qualityRedosDelete' },
    { name: 'Inspecciones', value: 'qualityInspections' },
    { name: 'Cronograma de Inspecciones', value: 'qualityInspectionsCrono' },
    {
      name: 'Lista general de Inspecciones',
      value: 'qualityInspectionsGeneralList'
    },
    { name: 'Lista personal de Inspecciones', value: 'qualityInspectionsPersonalList' },
    { name: 'Descargar Inspecciones', value: 'qualityInspectionsDownload' },
    { name: 'Editar Inspecciones', value: 'qualityInspectionsEdit' },
    { name: 'Eliminar Inspecciones', value: 'qualityInspectionsDelete' },
    { name: 'Observaciones personales', value: 'qualityInspectionsSingleObservations' },
    { name: 'Eliminar Observaciones', value: 'qualityInspectionsSingleObservationsDelete' },
    { name: 'Lista general de Observaciones', value: 'qualityInspectionsSingleObservationsGeneralList' },
    { name: 'Lista personal de Observaciones', value: 'qualityInspectionsSingleObservationsPersonalList' },
    { name: 'Tareas', value: 'qualityTasks' },
    { name: 'Formulario de Tareas', value: 'qualityTasksForm' },
    { name: 'Lista general de Tareas', value: 'qualityTasksGeneralList' },
    { name: 'Lista personal de Tareas', value: 'qualityTasksPersonalList' },
    { name: 'Editar Tareas', value: 'qualityTasksEdit' },
    { name: 'Eliminar Tareas', value: 'qualityTasksDelete' },
  ];

  maintenanceSelection = new SelectionModel<any>(true, []);
  maintenanceKeys: Array<any> = [
    { name: 'Solicitudes', value: 'maintenanceRequests' },
    { name: 'Formulario de Solicitudes', value: 'maintenanceRequestsForm' },
    {
      name: 'Lista general de Solicitudes',
      value: 'maintenanceRequestsGeneralList'
    },
    { name: 'Lista personal de Solicitudes', value: 'maintenanceRequestsPersonalList' },
    { name: 'Descargar Solicitudes', value: 'maintenanceRequestsDownload' },
    { name: 'Editar Solicitudes', value: 'maintenanceRequestsEdit' },
    { name: 'Eliminar Solicitudes', value: 'maintenanceRequestsDelete' },
  ];

  ssggSelection = new SelectionModel<any>(true, []);
  ssggKeys: Array<any> = [
    { name: 'Solicitudes', value: 'ssggRequests' },
    { name: 'Formulario de Solicitudes', value: 'ssggRequestsForm' },
    { name: 'Lista general de Solicitudes', value: 'ssggRequestsGeneralList' },
    { name: 'Lista personal de Solicitudes', value: 'ssggRequestsPersonalList' },
    { name: 'Descargar Solicitudes', value: 'ssggRequestsDownload' },
    { name: 'Editar Solicitudes', value: 'ssggRequestsEdit' },
    { name: 'Eliminar Solicitudes', value: 'ssggRequestsDelete' },
  ];

  logisticsSelection = new SelectionModel<any>(true, []);
  logisticsKeys: Array<any> = [
    { name: 'Fuera de servicio', value: 'logisticsOutOfService' },
    { name: 'Configuración', value: 'logisticsOutOfServiceConfiguration' },
    { name: 'Busqueda', value: 'logisticsOutOfServiceSearch' },
    { name: 'Inventario', value: 'logisticsOutOfServiceStocktaking' },
    { name: 'Editar Inventario', value: 'logisticsOutOfServiceStocktakingEditAction' },
    { name: 'Borrar Inventario', value: 'logisticsOutOfServiceStocktakingDeleteAction' },
    { name: 'Runner', value: 'logisticsRunner' }
  ];

  utilizationSelection = new SelectionModel<any>(true, []);
  utilizationKeys: Array<any> = [
    { name: 'Registros', value: 'utilizationRegisters' },
    { name: 'Horómetros', value: 'utilizationHorometers' },
    { name: 'Tendencias', value: 'utilizationTrends' }
  ];

  rtdSelection = new SelectionModel<any>(true, []);
  rtdKeys: Array<any> = [
    { name: 'TAGs', value: 'rtdTags' },
    { name: 'Master', value: 'rtdMaster' }
  ];

  configurationSelection = new SelectionModel<any>(true, []);
  configurationKeys: Array<any> = [
    { name: 'Usuarios', value: 'configurationUsers' },
    { name: 'Valores del sistema', value: 'configurationSystem' },
    { name: 'Notificaciones', value: 'configurationNotification' }
  ];

  constructor(
    private fb: FormBuilder,
    public dbs: DatabaseService,
    private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateNewPermitComponent>
  ) { }

  ngOnInit() {
    this.detailsFormGroup = this.fb.group({
      name: ['', Validators.required]
    })

    this.nameExist$ = combineLatest(
      this.dbs.permitsList$,
      this.detailsFormGroup.get('name').valueChanges.pipe(
        startWith<any>(''),
        filter(input => input !== null),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.name.toLowerCase()))
    ).pipe(
      map(([permits, name]) => {
        this.permitsResults = permits.filter(option =>
          option['name'] === name);
        if (this.permitsResults.length > 0) {
          return true
        } else {
          return false;
        }
      })
    );

    this.permitsConfigurationFormGroup = this.fb.group({

      securitySection: false,
      securityFred: false,
      securityFredForm: false,
      securityFredGeneralList: false,
      securityFredPersonalList: false,
      securityFredDownload: false,
      securityFredEdit: false,
      securityFredDelete: false,
      securityInspections: false,
      securityInspectionsCrono: false,
      securityInspectionsGeneralList: false,
      securityInspectionsPersonalList: false,
      securityInspectionsDownload: false,
      securityInspectionsEdit: false,
      securityInspectionsDelete: false,
      securityTasks: false,
      securityTasksGeneralList: false,
      securityTasksPersonalList: false,
      securityTasksEdit: false,
      securityTasksDelete: false,

      qualitySection: false,
      qualityRedos: false,
      qualityRedosGeneralList: false,
      qualityRedosPersonalList: false,
      qualityRedosDownload: false,
      qualityRedosEdit: false,
      qualityRedosDelete: false,
      qualityInspections: false,
      qualityInspectionsCrono: false,
      qualityInspectionsGeneralList: false,
      qualityInspectionsPersonalList: false,
      qualityInspectionsDownload: false,
      qualityInspectionsEdit: false,
      qualityInspectionsDelete: false,
      qualityInspectionsSingleObservations: false,
      qualityInspectionsSingleObservationsDelete: false,
      qualityInspectionsSingleObservationsGeneralList: false,
      qualityInspectionsSingleObservationsPersonalList: false,
      qualityTasks: false,
      qualityTasksForm: false,
      qualityTasksGeneralList: false,
      qualityTasksPersonalList: false,
      qualityTasksEdit: false,
      qualityTasksDelete: false,

      maintenanceSection: false,
      maintenanceRequests: false,
      maintenanceRequestsForm: false,
      maintenanceRequestsGeneralList: false,
      maintenanceRequestsPersonalList: false,
      maintenanceRequestsDownload: false,
      maintenanceRequestsEdit: false,
      maintenanceRequestsDelete: false,

      ssggSection: false,
      ssggRequests: false,
      ssggRequestsForm: false,
      ssggRequestsGeneralList: false,
      ssggRequestsPersonalList: false,
      ssggRequestsDownload: false,
      ssggRequestsEdit: false,
      ssggRequestsDelete: false,

      logisticsSection: false,
      logisticsOutOfService: false,
      logisticsOutOfServiceConfiguration: false,
      logisticsOutOfServiceSearch: false,
      logisticsOutOfServiceStocktaking: false,
      logisticsOutOfServiceStocktakingEditAction: false,
      logisticsOutOfServiceStocktakingDeleteAction: false,
      logisticsRunner: false,

      utilizationSection: false,
      utilizationRegisters: false,
      utilizationHorometers: false,
      utilizationTrends: false,

      rtdSection: false,
      rtdTags: false,
      rtdMaster: false,

      configurationSection: false,
      configurationUsers: false,
      configurationSystem: false,
      configurationNotification: false

    })

    this.securitySelection.onChange
      .pipe(
        debounceTime(1000)
      )
      .subscribe(res => {

        if (!this.securitySelection.hasValue()) {
          this.permitsConfigurationFormGroup.get('securitySection').setValue(false);
        } else {
          this.permitsConfigurationFormGroup.get('securitySection').setValue(true);
        }
      })

    this.qualitySelection.onChange
      .pipe(
        debounceTime(1000)
      )
      .subscribe(res => {
        if (!this.qualitySelection.hasValue()) {
          this.permitsConfigurationFormGroup.get('qualitySection').setValue(false);
        } else {
          this.permitsConfigurationFormGroup.get('qualitySection').setValue(true);
        }
      })

    this.maintenanceSelection.onChange
      .pipe(
        debounceTime(1000)
      )
      .subscribe(res => {
        if (!this.maintenanceSelection.hasValue()) {
          this.permitsConfigurationFormGroup.get('maintenanceSection').setValue(false);
        } else {
          this.permitsConfigurationFormGroup.get('maintenanceSection').setValue(true);
        }
      })

    this.ssggSelection.onChange
      .pipe(
        debounceTime(1000)
      )
      .subscribe(res => {
        if (!this.ssggSelection.hasValue()) {
          this.permitsConfigurationFormGroup.get('ssggSection').setValue(false);
        } else {
          this.permitsConfigurationFormGroup.get('ssggSection').setValue(true);
        }
      })

    this.logisticsSelection.onChange
      .pipe(
        debounceTime(1000)
      )
      .subscribe(res => {
        if (!this.logisticsSelection.hasValue()) {
          this.permitsConfigurationFormGroup.get('logisticsSection').setValue(false);
        } else {
          this.permitsConfigurationFormGroup.get('logisticsSection').setValue(true);
        }
      })

    this.utilizationSelection.onChange
      .pipe(
        debounceTime(1000)
      )
      .subscribe(res => {
        if (!this.utilizationSelection.hasValue()) {
          this.permitsConfigurationFormGroup.get('utilizationSection').setValue(false);
        } else {
          this.permitsConfigurationFormGroup.get('utilizationSection').setValue(true);
        }
      })

    this.rtdSelection.onChange
      .pipe(
        debounceTime(1000)
      )
      .subscribe(res => {
        if (!this.rtdSelection.hasValue()) {
          this.permitsConfigurationFormGroup.get('rtdSection').setValue(false);
        } else {
          this.permitsConfigurationFormGroup.get('rtdSection').setValue(true);
        }
      })

    this.configurationSelection.onChange
      .pipe(
        debounceTime(1000)
      )
      .subscribe(res => {
        if (!this.configurationSelection.hasValue()) {
          this.permitsConfigurationFormGroup.get('configurationSection').setValue(false);
        } else {
          this.permitsConfigurationFormGroup.get('configurationSection').setValue(true);
        }
      })
  }

  // SECURITY METHODS

  isAllSecuritySelected() {

    const numSelected = this.securitySelection.selected.length;

    return numSelected === this.securityKeys.length;
  }

  masterSecurityToggle() {
    if (this.isAllSecuritySelected()) {
      this.securitySelection.clear();
      this.securityKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(false));
      this.permitsConfigurationFormGroup.get('securitySection').setValue(false)
    } else {
      this.securityKeys.forEach(key => this.securitySelection.select(key['value']));
      this.securityKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(true));
    }
  }

  // QUALITY METHODS
  isAllQualitySelected() {
    const numSelected = this.qualitySelection.selected.length;

    return numSelected === this.qualityKeys.length;
  }

  masterQualityToggle() {
    if (this.isAllQualitySelected()) {
      this.qualitySelection.clear();
      this.qualityKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(false));
      this.permitsConfigurationFormGroup.get('qualitySection').setValue(false)
    } else {
      this.qualityKeys.forEach(key => this.qualitySelection.select(key['value']));
      this.qualityKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(true));
    }
  }

  // MAINTENANCE METHODS
  isAllMaintenanceSelected() {
    const numSelected = this.maintenanceSelection.selected.length;

    return numSelected === this.maintenanceKeys.length;
  }

  masterMaintenanceToggle() {
    if (this.isAllMaintenanceSelected()) {
      this.maintenanceSelection.clear();
      this.maintenanceKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(false));
      this.permitsConfigurationFormGroup.get('maintenanceSection').setValue(false)
    } else {
      this.maintenanceKeys.forEach(key => this.maintenanceSelection.select(key['value']));
      this.maintenanceKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(true));
    }
  }

  // SSGG METHODS
  isAllSsggSelected() {
    const numSelected = this.ssggSelection.selected.length;

    return numSelected === this.ssggKeys.length;
  }

  masterSsggToggle() {
    if (this.isAllSsggSelected()) {
      this.ssggSelection.clear();
      this.ssggKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(false));
      this.permitsConfigurationFormGroup.get('ssggSection').setValue(false)
    } else {
      this.ssggKeys.forEach(key => this.ssggSelection.select(key['value']));
      this.ssggKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(true));
    }
  }

  // LOGISTICS METHODS
  isAllLogisticsSelected() {
    const numSelected = this.logisticsSelection.selected.length;

    return numSelected === this.logisticsKeys.length;
  }

  masterLogisticsToggle() {
    if (this.isAllLogisticsSelected()) {
      this.logisticsSelection.clear();
      this.logisticsKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(false));
      this.permitsConfigurationFormGroup.get('logisticsSection').setValue(false)
    } else {
      this.logisticsKeys.forEach(key => this.logisticsSelection.select(key['value']));
      this.logisticsKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(true));
    }
  }

  // UTILIZATION METHODS
  isAllUtilizationSelected() {
    const numSelected = this.utilizationSelection.selected.length;

    return numSelected === this.utilizationKeys.length;
  }

  masterUtilizationToggle() {
    if (this.isAllUtilizationSelected()) {
      this.utilizationSelection.clear();
      this.utilizationKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(false));
      this.permitsConfigurationFormGroup.get('utilizationSection').setValue(false)
    } else {
      this.utilizationKeys.forEach(key => this.utilizationSelection.select(key['value']));
      this.utilizationKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(true));
    }
  }

  // RTD METHODS
  isAllRtdSelected() {
    const numSelected = this.rtdSelection.selected.length;

    return numSelected === this.rtdKeys.length;
  }

  masterRtdToggle() {
    if (this.isAllRtdSelected()) {
      this.rtdSelection.clear();
      this.rtdKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(false));
      this.permitsConfigurationFormGroup.get('rtdSection').setValue(false)
    } else {
      this.rtdKeys.forEach(key => this.rtdSelection.select(key['value']));
      this.rtdKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(true));
    }
  }

  // CONFIGURATION METHODS
  isAllConfigurationSelected() {
    const numSelected = this.configurationSelection.selected.length;

    return numSelected === this.configurationKeys.length;
  }

  masterConfigurationToggle() {
    if (this.isAllConfigurationSelected()) {
      this.configurationSelection.clear();
      this.configurationKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(false));
      this.permitsConfigurationFormGroup.get('configurationSection').setValue(false)
    } else {
      this.configurationKeys.forEach(key => this.configurationSelection.select(key['value']));
      this.configurationKeys.forEach(key => this.permitsConfigurationFormGroup.get(key['value']).setValue(true));
    }
  }

  create(): void {
    let _permits: Role = this.permitsConfigurationFormGroup.value;

    _permits['name'] = this.detailsFormGroup.value['name'];
    _permits['regDate'] = Date.now();
    _permits['securitySection'] = this.securitySelection.selected.length > 0 ? true : false;
    _permits['qualitySection'] = this.qualitySelection.selected.length > 0 ? true : false;
    _permits['maintenanceSection'] = this.maintenanceSelection.selected.length > 0 ? true : false;
    _permits['ssggSection'] = this.ssggSelection.selected.length > 0 ? true : false;
    _permits['logisticsSection'] = this.logisticsSelection.selected.length > 0 ? true : false;
    _permits['utilizationSection'] = this.utilizationSelection.selected.length > 0 ? true : false;
    _permits['rtdSection'] = this.rtdSelection.selected.length > 0 ? true : false;
    _permits['configurationSection'] = this.configurationSelection.selected.length > 0 ? true : false;

    this.dbs.permitsCollection
      .add(_permits)
      .then(ref => {
        ref.update({
          id: ref.id
        });
        this.snackbar.open("Listo!", "Cerrar");
        this.dialogRef.close(true);
      })
      .catch(err => {
        console.log(err);
        this.snackbar.open("Ups...Parece que hubo un error al guardar el permiso", "Cerrar");
        this.dialogRef.close(true);
      })

  }

}
